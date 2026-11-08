# Category revenue / Ricavi per categoria

Difficulty / Difficoltà: **4/10**  
Topics / Argomenti: $unwind, $group, $addToSet, $size

## Task

Load [`execise.json`](execise.json) into `items` with `insertMany()`. Alternatively, run [`setup.js`](setup.js) as explained in the [series README](../README.md). It replaces this exercise's collections in `aggregation_practice`.

Expand the `lines` of paid orders. For each category calculate `units`, `revenue` (sum of quantity times unit price), and `orderCount` (distinct orders containing that category). Empty, null, or missing arrays contribute nothing. Return only `category`, `units`, `revenue`, and `orderCount`. Sort by revenue descending, then category ascending.

## Richiesta in italiano

Carica [`execise.json`](execise.json) in `items` usando `insertMany()`. In alternativa esegui [`setup.js`](setup.js) come indicato nel [README della serie](../README.md). Sostituisce le collection di questo esercizio in `aggregation_practice`.

Espandi `lines` degli ordini pagati. Per ogni categoria calcola `units`, `revenue` (somma di quantità per prezzo unitario) e `orderCount` (numero di ordini distinti che contengono quella categoria). Gli array vuoti, null o mancanti non contribuiscono. Restituisci solo `category`, `units`, `revenue` e `orderCount`. Ordina per ricavi decrescenti e categoria crescente.

## Expected result / Risultato atteso

```json
[
  {
    "category": "electronics",
    "units": 3,
    "revenue": 220,
    "orderCount": 2
  },
  {
    "category": "books",
    "units": 6,
    "revenue": 80,
    "orderCount": 2
  },
  {
    "category": "home",
    "units": 2,
    "revenue": 50,
    "orderCount": 1
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
  { $group: {
    _id: "$lines.category", units: { $sum: "$lines.quantity" },
    revenue: { $sum: { $multiply: ["$lines.quantity", "$lines.unitPrice"] } },
    orderIds: { $addToSet: "$_id" }
  } },
  { $project: { _id: 0, category: "$_id", units: 1, revenue: 1, orderCount: { $size: "$orderIds" } } },
  { $sort: { revenue: -1, category: 1 } }
])
```

**English:** An order can have several lines in the same category. Counting unwound rows would overcount orders; deduplicate IDs with `$addToSet`.

**Italiano:** Un ordine può avere più righe della stessa categoria. Contare le righe espanse sovrastimerebbe gli ordini: usa `$addToSet` sugli identificativi.
