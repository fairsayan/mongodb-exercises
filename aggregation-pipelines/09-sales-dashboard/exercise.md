# Sales dashboard / Dashboard vendite

Difficulty / Difficoltà: **9/10**  
Topics / Argomenti: $facet, $bucket, grouped metrics, pagination

## Task

Load [`execise.json`](execise.json) into `items` with `insertMany()`. Alternatively, run [`setup.js`](setup.js) as explained in the [series README](../README.md). It replaces this exercise's collections in `aggregation_practice`.

Build one report document for paid orders using a single `aggregate()` and `$facet`. Return four arrays: `summary` with orderCount, revenue, and averageOrder rounded to two decimals; `byCategory` with category, orderCount, and revenue sorted by revenue descending then category ascending; `priceBands` with band, orderCount, and revenue for buckets `[0,50)`, `[50,100)`, `[100,200)`, and default `200+`; `page` containing the second page of two orders sorted by total descending and `_id` ascending, with only `_id`, category, and total. Use numeric lower bounds 0, 50, 100 as the first three band labels and string `200+` for the default. Sort priceBands by band ascending (numeric labels before the string). Empty buckets are omitted.

## Richiesta in italiano

Carica [`execise.json`](execise.json) in `items` usando `insertMany()`. In alternativa esegui [`setup.js`](setup.js) come indicato nel [README della serie](../README.md). Sostituisce le collection di questo esercizio in `aggregation_practice`.

Costruisci un unico documento di report sugli ordini pagati con una sola `aggregate()` e `$facet`. Restituisci quattro array: `summary` con orderCount, revenue e averageOrder arrotondato a due decimali; `byCategory` con category, orderCount e revenue ordinati per ricavi decrescenti e categoria crescente; `priceBands` con band, orderCount e revenue per le fasce `[0,50)`, `[50,100)`, `[100,200)` e il default `200+`; `page` con la seconda pagina di due ordini, ordinati per total decrescente e `_id` crescente, includendo solo `_id`, category e total. Usa i limiti inferiori numerici 0, 50, 100 come etichette delle prime tre fasce e la stringa `200+` per il default. Ordina priceBands per band crescente (numeri prima della stringa). Ometti le fasce vuote.

## Expected result / Risultato atteso

```json
[
  {
    "summary": [
      {
        "orderCount": 6,
        "revenue": 700,
        "averageOrder": 116.67
      }
    ],
    "byCategory": [
      {
        "category": "electronics",
        "orderCount": 2,
        "revenue": 300
      },
      {
        "category": "home",
        "orderCount": 2,
        "revenue": 300
      },
      {
        "category": "books",
        "orderCount": 2,
        "revenue": 100
      }
    ],
    "priceBands": [
      {
        "band": 0,
        "orderCount": 1,
        "revenue": 40
      },
      {
        "band": 50,
        "orderCount": 2,
        "revenue": 110
      },
      {
        "band": 100,
        "orderCount": 1,
        "revenue": 100
      },
      {
        "band": "200+",
        "orderCount": 2,
        "revenue": 450
      }
    ],
    "page": [
      {
        "_id": 3,
        "category": "electronics",
        "total": 100
      },
      {
        "_id": 2,
        "category": "books",
        "total": 60
      }
    ]
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
  { $facet: {
    summary: [
      { $group: { _id: null, orderCount: { $sum: 1 }, revenue: { $sum: "$total" }, averageOrder: { $avg: "$total" } } },
      { $project: { _id: 0, orderCount: 1, revenue: 1, averageOrder: { $round: ["$averageOrder", 2] } } }
    ],
    byCategory: [
      { $group: { _id: "$category", orderCount: { $sum: 1 }, revenue: { $sum: "$total" } } },
      { $project: { _id: 0, category: "$_id", orderCount: 1, revenue: 1 } },
      { $sort: { revenue: -1, category: 1 } }
    ],
    priceBands: [
      { $bucket: { groupBy: "$total", boundaries: [0, 50, 100, 200], default: "200+",
        output: { orderCount: { $sum: 1 }, revenue: { $sum: "$total" } } } },
      { $project: { _id: 0, band: "$_id", orderCount: 1, revenue: 1 } },
      { $sort: { band: 1 } }
    ],
    page: [
      { $sort: { total: -1, _id: 1 } }, { $skip: 2 }, { $limit: 2 },
      { $project: { _id: 1, category: 1, total: 1 } }
    ]
  } }
])
```

**English:** Each facet sees the same paid orders. Pagination is local to `page`. Bucket lower bounds are inclusive and upper bounds exclusive; all input totals here are nonnegative.

**Italiano:** Ogni ramo vede gli stessi ordini pagati. La paginazione riguarda solo `page`. Le fasce includono il limite inferiore ed escludono quello superiore; tutti i totali di questo dataset sono non negativi.
