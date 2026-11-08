# Customer baskets / Carrelli dei clienti

Difficulty / Difficoltà: **5/10**  
Topics / Argomenti: $filter, $map, $reduce, $ifNull

## Task

Load [`execise.json`](execise.json) into `items` with `insertMany()`. Alternatively, run [`setup.js`](setup.js) as explained in the [series README](../README.md). It replaces this exercise's collections in `aggregation_practice`.

Produce one document per customer without `$unwind` or `$group`. Keep only lines with `active: true` and `quantity > 0`. Return `_id`, `customer`, `selectedLines` (objects containing only `sku` and computed `lineTotal`), and `basketTotal` (sum of selected line totals). Preserve original line order. Missing or null `lines` means an empty array; retain customers with no selected lines and total zero. Sort by basket total descending, then `_id` ascending. Use `$filter`, `$map`, and `$reduce`.

## Richiesta in italiano

Carica [`execise.json`](execise.json) in `items` usando `insertMany()`. In alternativa esegui [`setup.js`](setup.js) come indicato nel [README della serie](../README.md). Sostituisce le collection di questo esercizio in `aggregation_practice`.

Produci un documento per cliente senza `$unwind` o `$group`. Conserva solo le righe con `active: true` e `quantity > 0`. Restituisci `_id`, `customer`, `selectedLines` (oggetti con solo `sku` e `lineTotal` calcolato) e `basketTotal` (somma dei totali selezionati). Mantieni l’ordine originale delle righe. `lines` null o mancante equivale a un array vuoto; conserva i clienti senza righe selezionate con totale zero. Ordina per totale decrescente e `_id` crescente. Usa `$filter`, `$map` e `$reduce`.

## Expected result / Risultato atteso

```json
[
  {
    "_id": 5,
    "customer": "Eva",
    "selectedLines": [
      {
        "sku": "E",
        "lineTotal": 100
      }
    ],
    "basketTotal": 100
  },
  {
    "_id": 1,
    "customer": "Ada",
    "selectedLines": [
      {
        "sku": "A",
        "lineTotal": 40
      },
      {
        "sku": "C",
        "lineTotal": 30
      }
    ],
    "basketTotal": 70
  },
  {
    "_id": 2,
    "customer": "Ben",
    "selectedLines": [],
    "basketTotal": 0
  },
  {
    "_id": 3,
    "customer": "Cleo",
    "selectedLines": [],
    "basketTotal": 0
  },
  {
    "_id": 4,
    "customer": "Dan",
    "selectedLines": [],
    "basketTotal": 0
  },
  {
    "_id": 6,
    "customer": "Finn",
    "selectedLines": [],
    "basketTotal": 0
  }
]
```

The same output is available in [`expected.json`](expected.json). Field order and numeric formatting (`10` versus `10.0`) are not significant; document and array order are significant.  
Lo stesso output è disponibile in [`expected.json`](expected.json). L’ordine dei campi e il formato numerico (`10` oppure `10.0`) non sono significativi; l’ordine di documenti e array è significativo.

## Solution / Soluzione

Executable version / Versione eseguibile: [`solution.js`](solution.js).

```javascript
db.items.aggregate([
  { $set: { selectedLines: { $map: {
    input: { $filter: {
      input: { $ifNull: ["$lines", []] }, as: "line",
      cond: { $and: [{ $eq: ["$$line.active", true] }, { $gt: ["$$line.quantity", 0] }] }
    } }, as: "line",
    in: { sku: "$$line.sku", lineTotal: { $multiply: ["$$line.quantity", "$$line.unitPrice"] } }
  } } } },
  { $set: { basketTotal: { $reduce: {
    input: "$selectedLines", initialValue: 0, in: { $add: ["$$value", "$$this.lineTotal"] }
  } } } },
  { $sort: { basketTotal: -1, _id: 1 } },
  { $project: { _id: 1, customer: 1, selectedLines: 1, basketTotal: 1 } }
])
```

**English:** `$filter` selects lines, `$map` reshapes them, and `$reduce` folds the array into one value without multiplying documents.

**Italiano:** `$filter` seleziona le righe, `$map` le trasforma e `$reduce` ricava un unico valore senza moltiplicare i documenti.
