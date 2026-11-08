# Product catalog / Catalogo prodotti

Difficulty / Difficoltà: **1/10**  
Topics / Argomenti: $match, $project, $sort, $limit

## Task

Load [`execise.json`](execise.json) into `items` with `insertMany()`. Alternatively, run [`setup.js`](setup.js) as explained in the [series README](../README.md). It replaces this exercise's collections in `aggregation_practice`.

Find active products in `electronics` with `price >= 50`. Sort by `price` descending, then `_id` ascending, and return the first three. Include only `_id`, `name`, and `price`. Use an aggregation pipeline.

## Richiesta in italiano

Carica [`execise.json`](execise.json) in `items` usando `insertMany()`. In alternativa esegui [`setup.js`](setup.js) come indicato nel [README della serie](../README.md). Sostituisce le collection di questo esercizio in `aggregation_practice`.

Trova i prodotti attivi della categoria `electronics` con `price >= 50`. Ordina per `price` decrescente e poi per `_id` crescente; restituisci i primi tre. Includi soltanto `_id`, `name` e `price`. Usa una pipeline di aggregation.

## Expected result / Risultato atteso

```json
[
  {
    "_id": 2,
    "name": "Monitor",
    "price": 200
  },
  {
    "_id": 1,
    "name": "Keyboard",
    "price": 80
  },
  {
    "_id": 6,
    "name": "Headphones",
    "price": 80
  }
]
```

The same output is available in [`expected.json`](expected.json). Field order and numeric formatting (`10` versus `10.0`) are not significant; document and array order are significant.  
Lo stesso output è disponibile in [`expected.json`](expected.json). L’ordine dei campi e il formato numerico (`10` oppure `10.0`) non sono significativi; l’ordine di documenti e array è significativo.

## Solution / Soluzione

Executable version / Versione eseguibile: [`solution.js`](solution.js).

```javascript
db.items.aggregate([
  { $match: { active: true, category: "electronics", price: { $gte: 50 } } },
  { $sort: { price: -1, _id: 1 } },
  { $limit: 3 },
  { $project: { _id: 1, name: 1, price: 1 } }
])
```

**English:** The secondary sort makes equal prices deterministic. `$project` controls the output shape.

**Italiano:** Il secondo criterio rende deterministico l’ordine a parità di prezzo. `$project` definisce la struttura dei risultati.
