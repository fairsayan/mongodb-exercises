# Customer orders / Ordini e clienti

Difficulty / Difficoltà: **7/10**  
Topics / Argomenti: $lookup, $unwind with preserveNullAndEmptyArrays, $ifNull

## Task

Load [`execise.json`](execise.json) into `items` with `insertMany()`. Also load [`customers.json`](customers.json) into `customers` in the same database. Alternatively, run [`setup.js`](setup.js) as explained in the [series README](../README.md). It replaces this exercise's collections in `aggregation_practice`.

Join paid orders in `items` to `customers` using `customerId` and customer `_id`. Retain orders even when the customer is missing or has no match. Return only `orderId`, `customerName`, `city`, and `total`; use `Unknown` for a missing customer name and `N/A` for a missing city. Sort by total descending, then orderId ascending. Use `$lookup` followed by `$unwind` while preserving unmatched orders.

## Richiesta in italiano

Carica [`execise.json`](execise.json) in `items` usando `insertMany()`. Carica anche [`customers.json`](customers.json) in `customers` nello stesso database. In alternativa esegui [`setup.js`](setup.js) come indicato nel [README della serie](../README.md). Sostituisce le collection di questo esercizio in `aggregation_practice`.

Collega gli ordini pagati in `items` ai documenti di `customers` tramite `customerId` e `_id` del cliente. Conserva gli ordini anche se il cliente manca o non ha corrispondenza. Restituisci solo `orderId`, `customerName`, `city` e `total`; usa `Unknown` per il nome mancante e `N/A` per la città mancante. Ordina per totale decrescente e orderId crescente. Usa `$lookup` seguito da `$unwind`, conservando gli ordini senza corrispondenza.

## Expected result / Risultato atteso

```json
[
  {
    "orderId": 2,
    "customerName": "Ben",
    "city": "N/A",
    "total": 120
  },
  {
    "orderId": 1,
    "customerName": "Ada",
    "city": "Rome",
    "total": 90
  },
  {
    "orderId": 3,
    "customerName": "Unknown",
    "city": "N/A",
    "total": 70
  },
  {
    "orderId": 6,
    "customerName": "Unknown",
    "city": "N/A",
    "total": 40
  },
  {
    "orderId": 5,
    "customerName": "Ada",
    "city": "Rome",
    "total": 30
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
  { $lookup: { from: "customers", localField: "customerId", foreignField: "_id", as: "customer" } },
  { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
  { $project: { _id: 0, orderId: "$_id", customerName: { $ifNull: ["$customer.name", "Unknown"] },
    city: { $ifNull: ["$customer.city", "N/A"] }, total: 1 } },
  { $sort: { total: -1, orderId: 1 } }
])
```

**English:** `$lookup` returns an array. Preserving empty arrays in `$unwind` implements a left join instead of discarding unmatched orders.

**Italiano:** `$lookup` restituisce un array. Conservare gli array vuoti in `$unwind` realizza un left join senza scartare gli ordini privi di cliente.
