# City sales / Vendite per città

Difficulty / Difficoltà: **3/10**  
Topics / Argomenti: $group, $sum, $avg, $cond

## Task

Load [`execise.json`](execise.json) into `items` with `insertMany()`. Alternatively, run [`setup.js`](setup.js) as explained in the [series README](../README.md). It replaces this exercise's collections in `aggregation_practice`.

Consider only paid orders. For each city compute `orderCount`, `revenue`, `averageOrder` rounded to two decimal places, and `largeOrders` (orders with `total >= 150`). Keep cities with at least two paid orders and revenue of at least 200. Return `city` instead of `_id`; sort by revenue descending, then city ascending.

## Richiesta in italiano

Carica [`execise.json`](execise.json) in `items` usando `insertMany()`. In alternativa esegui [`setup.js`](setup.js) come indicato nel [README della serie](../README.md). Sostituisce le collection di questo esercizio in `aggregation_practice`.

Considera solo gli ordini pagati. Per ogni città calcola `orderCount`, `revenue`, `averageOrder` arrotondato a due decimali e `largeOrders` (ordini con `total >= 150`). Mantieni le città con almeno due ordini pagati e ricavi almeno pari a 200. Restituisci `city` al posto di `_id`; ordina per ricavi decrescenti e poi città crescente.

## Expected result / Risultato atteso

```json
[
  {
    "city": "Rome",
    "orderCount": 3,
    "revenue": 450,
    "averageOrder": 150,
    "largeOrders": 2
  },
  {
    "city": "Milan",
    "orderCount": 2,
    "revenue": 200,
    "averageOrder": 100,
    "largeOrders": 0
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
  { $group: {
    _id: "$city", orderCount: { $sum: 1 }, revenue: { $sum: "$total" },
    averageOrder: { $avg: "$total" },
    largeOrders: { $sum: { $cond: [{ $gte: ["$total", 150] }, 1, 0] } }
  } },
  { $match: { orderCount: { $gte: 2 }, revenue: { $gte: 200 } } },
  { $project: { _id: 0, city: "$_id", orderCount: 1, revenue: 1,
    averageOrder: { $round: ["$averageOrder", 2] }, largeOrders: 1 } },
  { $sort: { revenue: -1, city: 1 } }
])
```

**English:** The first `$match` filters orders; the second filters groups. `$sum` with `$cond` implements a conditional count.

**Italiano:** Il primo `$match` filtra gli ordini; il secondo filtra i gruppi. `$sum` con `$cond` realizza un conteggio condizionale.
