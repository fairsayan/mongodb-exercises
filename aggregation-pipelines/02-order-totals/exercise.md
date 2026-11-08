# Order totals / Totali degli ordini

Difficulty / Difficoltà: **2/10**  
Topics / Argomenti: $set, $multiply, $subtract, $ifNull, $round

## Task

Load [`execise.json`](execise.json) into `items` with `insertMany()`. Alternatively, run [`setup.js`](setup.js) as explained in the [series README](../README.md). It replaces this exercise's collections in `aggregation_practice`.

For paid orders, calculate `subtotal = quantity * unitPrice` and `netTotal = subtotal * (1 - discountPct / 100)`, rounded to two decimal places. Treat missing or null discounts as zero. Keep orders whose rounded `netTotal >= 60`. Return only `_id`, `customer`, `subtotal`, and `netTotal`, ordered by `netTotal` descending and `_id` ascending.

## Richiesta in italiano

Carica [`execise.json`](execise.json) in `items` usando `insertMany()`. In alternativa esegui [`setup.js`](setup.js) come indicato nel [README della serie](../README.md). Sostituisce le collection di questo esercizio in `aggregation_practice`.

Per gli ordini pagati calcola `subtotal = quantity * unitPrice` e `netTotal = subtotal * (1 - discountPct / 100)`, arrotondato a due decimali. Considera zero gli sconti mancanti o null. Mantieni gli ordini con `netTotal` arrotondato almeno pari a `60`. Restituisci solo `_id`, `customer`, `subtotal` e `netTotal`, ordinando per `netTotal` decrescente e `_id` crescente.

## Expected result / Risultato atteso

```json
[
  {
    "_id": 2,
    "customer": "Ben",
    "subtotal": 75,
    "netTotal": 75
  },
  {
    "_id": 1,
    "customer": "Ada",
    "subtotal": 80,
    "netTotal": 72
  },
  {
    "_id": 4,
    "customer": "Dan",
    "subtotal": 70,
    "netTotal": 70
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
  { $set: { subtotal: { $multiply: ["$quantity", "$unitPrice"] } } },
  { $set: { netTotal: { $round: [
    { $multiply: ["$subtotal", { $subtract: [1, { $divide: [{ $ifNull: ["$discountPct", 0] }, 100] }] }] }, 2
  ] } } },
  { $match: { netTotal: { $gte: 60 } } },
  { $sort: { netTotal: -1, _id: 1 } },
  { $project: { _id: 1, customer: 1, subtotal: 1, netTotal: 1 } }
])
```

**English:** Use separate `$set` stages because `netTotal` depends on the newly calculated `subtotal`. Round before filtering.

**Italiano:** Usa due stage `$set` perché `netTotal` dipende dal nuovo campo `subtotal`. Arrotonda prima di filtrare.
