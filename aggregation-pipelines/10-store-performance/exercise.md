# Store performance / Andamento dei negozi

Difficulty / Difficoltà: **10/10**  
Topics / Argomenti: $unwind, $lookup, daily $group, $setWindowFields, $denseRank

## Task

Load [`execise.json`](execise.json) into `items` with `insertMany()`. Also load [`products.json`](products.json) into `products` in the same database. Alternatively, run [`setup.js`](setup.js) as explained in the [series README](../README.md). It replaces this exercise's collections in `aggregation_practice`.

Build a daily store report from paid orders. Expand lines and join `products` by SKU; discard unmatched lines. Calculate line revenue using the catalog unitPrice (ignore price history). Group by store and UTC calendar day (`YYYY-MM-DD`), computing `dailyRevenue` and `orderCount` of distinct orders with at least one matched line. Omit days without matched lines. For each store, in day order, compute `cumulativeRevenue` and `movingAverage` of daily revenue over the current and previous available row, rounded to two decimals. This is a two-row window, not two calendar days. In a second window stage, compute `revenueRank` within each store using descending daily revenue and `$denseRank` (ties share rank; no gaps). Return only store, day, orderCount, dailyRevenue, cumulativeRevenue, movingAverage, and revenueRank; sort by store then day ascending. Use a single pipeline including `$lookup`, `$group`, and two `$setWindowFields` stages.

## Richiesta in italiano

Carica [`execise.json`](execise.json) in `items` usando `insertMany()`. Carica anche [`products.json`](products.json) in `products` nello stesso database. In alternativa esegui [`setup.js`](setup.js) come indicato nel [README della serie](../README.md). Sostituisce le collection di questo esercizio in `aggregation_practice`.

Costruisci un report giornaliero per negozio dagli ordini pagati. Espandi le righe e collegale a `products` tramite SKU; scarta le righe senza corrispondenza. Calcola i ricavi di riga con unitPrice del catalogo (ignora lo storico dei prezzi). Raggruppa per negozio e giorno di calendario UTC (`YYYY-MM-DD`), calcolando `dailyRevenue` e `orderCount` degli ordini distinti con almeno una riga valida. Ometti i giorni senza righe valide. Per ogni negozio, in ordine di giorno, calcola `cumulativeRevenue` e `movingAverage` dei ricavi del giorno corrente e della precedente riga disponibile, arrotondata a due decimali. La finestra comprende due righe, non due giorni di calendario. In un secondo stage finestra calcola `revenueRank` per negozio con ricavi giornalieri decrescenti e `$denseRank` (stesso rango a parità, senza salti). Restituisci solo store, day, orderCount, dailyRevenue, cumulativeRevenue, movingAverage e revenueRank; ordina per negozio e giorno crescenti. Usa una sola pipeline con `$lookup`, `$group` e due stage `$setWindowFields`.

## Expected result / Risultato atteso

```json
[
  {
    "store": "Milan",
    "day": "2025-03-01",
    "orderCount": 1,
    "dailyRevenue": 10,
    "cumulativeRevenue": 10,
    "movingAverage": 10,
    "revenueRank": 2
  },
  {
    "store": "Milan",
    "day": "2025-03-03",
    "orderCount": 1,
    "dailyRevenue": 20,
    "cumulativeRevenue": 30,
    "movingAverage": 15,
    "revenueRank": 1
  },
  {
    "store": "Milan",
    "day": "2025-03-04",
    "orderCount": 1,
    "dailyRevenue": 20,
    "cumulativeRevenue": 50,
    "movingAverage": 20,
    "revenueRank": 1
  },
  {
    "store": "Rome",
    "day": "2025-03-01",
    "orderCount": 2,
    "dailyRevenue": 50,
    "cumulativeRevenue": 50,
    "movingAverage": 50,
    "revenueRank": 2
  },
  {
    "store": "Rome",
    "day": "2025-03-02",
    "orderCount": 1,
    "dailyRevenue": 40,
    "cumulativeRevenue": 90,
    "movingAverage": 45,
    "revenueRank": 3
  },
  {
    "store": "Rome",
    "day": "2025-03-04",
    "orderCount": 1,
    "dailyRevenue": 60,
    "cumulativeRevenue": 150,
    "movingAverage": 50,
    "revenueRank": 1
  }
]
```

The same output is available in [`expected.json`](expected.json). Field order and numeric formatting (`10` versus `10.0`) are not significant; document and array order are significant.  
Lo stesso output è disponibile in [`expected.json`](expected.json). L’ordine dei campi e il formato numerico (`10` oppure `10.0`) non sono significativi; l’ordine di documenti e array è significativo.

## Solution / Soluzione

Executable version / Versione eseguibile: [`solution.js`](solution.js).

```javascript
db.items.aggregate([
  { $match: { status: "paid" } },
  { $unwind: "$lines" },
  { $lookup: { from: "products", localField: "lines.sku", foreignField: "sku", as: "product" } },
  { $unwind: "$product" },
  { $group: {
    _id: { store: "$store", day: { $dateToString: { date: { $toDate: "$orderedAt" }, format: "%Y-%m-%d", timezone: "UTC" } } },
    dailyRevenue: { $sum: { $multiply: ["$lines.quantity", "$product.unitPrice"] } },
    orderIds: { $addToSet: "$_id" }
  } },
  { $project: { _id: 0, store: "$_id.store", day: "$_id.day", dailyRevenue: 1, orderCount: { $size: "$orderIds" } } },
  { $setWindowFields: {
    partitionBy: "$store", sortBy: { day: 1 },
    output: {
      cumulativeRevenue: { $sum: "$dailyRevenue", window: { documents: ["unbounded", "current"] } },
      movingAverage: { $avg: "$dailyRevenue", window: { documents: [-1, 0] } }
    }
  } },
  { $setWindowFields: {
    partitionBy: "$store", sortBy: { dailyRevenue: -1 },
    output: { revenueRank: { $denseRank: {} } }
  } },
  { $set: { movingAverage: { $round: ["$movingAverage", 2] } } },
  { $sort: { store: 1, day: 1 } }
])
```

**English:** Catalog SKUs are unique in this dataset. Deduplicate order IDs after the join; an order with two valid lines still counts once. Group before windowing so each row represents one store-day. A separate revenue ordering is needed for rank, and the final sort restores chronological output. All dates in this dataset are valid ISO strings.

**Italiano:** Gli SKU del catalogo sono univoci in questo dataset. Deduplica gli ID dopo il join: un ordine con due righe valide conta una volta. Raggruppa prima delle finestre per ottenere una riga per negozio e giorno. Il rango richiede un ordinamento distinto per ricavi; il sort finale ripristina l’ordine cronologico. Tutte le date del dataset sono stringhe ISO valide.
