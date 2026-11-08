# Monthly revenue / Ricavi mensili

Difficulty / Difficoltà: **6/10**  
Topics / Argomenti: $convert, $dateToString, timezone, multi-field $group

## Task

Load [`execise.json`](execise.json) into `items` with `insertMany()`. Alternatively, run [`setup.js`](setup.js) as explained in the [series README](../README.md). It replaces this exercise's collections in `aggregation_practice`.

Convert the ISO strings in `orderedAt` to dates. Exclude unpaid orders and orders with invalid, null, or missing dates, without failing the pipeline. Group by calendar month in `Europe/Rome` and by `channel`. Return only `month` (`YYYY-MM`), `channel`, `orderCount`, and `revenue`; sort by month ascending, revenue descending, then channel ascending. Use `$convert` with `onError` and `onNull`.

## Richiesta in italiano

Carica [`execise.json`](execise.json) in `items` usando `insertMany()`. In alternativa esegui [`setup.js`](setup.js) come indicato nel [README della serie](../README.md). Sostituisce le collection di questo esercizio in `aggregation_practice`.

Converti in date le stringhe ISO di `orderedAt`. Escludi gli ordini non pagati e quelli con date non valide, null o mancanti, senza far fallire la pipeline. Raggruppa per mese di calendario nel fuso `Europe/Rome` e per `channel`. Restituisci solo `month` (`YYYY-MM`), `channel`, `orderCount` e `revenue`; ordina per mese crescente, ricavi decrescenti e canale crescente. Usa `$convert` con `onError` e `onNull`.

## Expected result / Risultato atteso

```json
[
  {
    "month": "2025-01",
    "channel": "web",
    "orderCount": 1,
    "revenue": 40
  },
  {
    "month": "2025-02",
    "channel": "web",
    "orderCount": 2,
    "revenue": 160
  },
  {
    "month": "2025-02",
    "channel": "store",
    "orderCount": 1,
    "revenue": 50
  },
  {
    "month": "2025-03",
    "channel": "store",
    "orderCount": 1,
    "revenue": 90
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
  { $set: { orderDate: { $convert: { input: "$orderedAt", to: "date", onError: null, onNull: null } } } },
  { $match: { orderDate: { $ne: null } } },
  { $group: {
    _id: { month: { $dateToString: { date: "$orderDate", format: "%Y-%m", timezone: "Europe/Rome" } }, channel: "$channel" },
    orderCount: { $sum: 1 }, revenue: { $sum: "$total" }
  } },
  { $project: { _id: 0, month: "$_id.month", channel: "$_id.channel", orderCount: 1, revenue: 1 } },
  { $sort: { month: 1, revenue: -1, channel: 1 } }
])
```

**English:** The two orders at 23:30 UTC belong to the following month in Rome. JSON stores strings, so conversion happens inside the pipeline.

**Italiano:** I due ordini delle 23:30 UTC appartengono al mese successivo a Roma. Il JSON contiene stringhe: la conversione avviene nella pipeline.
