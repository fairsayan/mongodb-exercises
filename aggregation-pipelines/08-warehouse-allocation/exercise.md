# Warehouse allocation / Assegnazione magazzini

Difficulty / Difficoltà: **8/10**  
Topics / Argomenti: correlated $lookup, let, $expr, $sort, $limit

## Task

Load [`execise.json`](execise.json) into `items` with `insertMany()`. Also load [`inventory.json`](inventory.json) into `inventory` in the same database. Alternatively, run [`setup.js`](setup.js) as explained in the [series README](../README.md). It replaces this exercise's collections in `aggregation_practice`.

For every pending order, find a single warehouse record in `inventory` with the same SKU and country and `stock >= quantity`. Do not combine stock from different warehouses. Choose the eligible warehouse with the lowest `shippingCost`, then the lowest `_id`. Return only `orderId`, `sku`, `quantity`, `warehouse`, and `shippingCost`. If no warehouse qualifies, return `warehouse: "unavailable"` and `shippingCost: null`. Keep all pending orders, sorted by orderId ascending. Use a correlated `$lookup` with `let`, a pipeline, and `$expr`.

## Richiesta in italiano

Carica [`execise.json`](execise.json) in `items` usando `insertMany()`. Carica anche [`inventory.json`](inventory.json) in `inventory` nello stesso database. In alternativa esegui [`setup.js`](setup.js) come indicato nel [README della serie](../README.md). Sostituisce le collection di questo esercizio in `aggregation_practice`.

Per ogni ordine pending, cerca un singolo documento di `inventory` con stesso SKU e paese e `stock >= quantity`. Non sommare le scorte di magazzini diversi. Scegli il magazzino idoneo con `shippingCost` minore e poi `_id` minore. Restituisci solo `orderId`, `sku`, `quantity`, `warehouse` e `shippingCost`. Se nessun magazzino è idoneo, restituisci `warehouse: "unavailable"` e `shippingCost: null`. Conserva tutti gli ordini pending, ordinati per orderId crescente. Usa un `$lookup` correlato con `let`, pipeline e `$expr`.

## Expected result / Risultato atteso

```json
[
  {
    "orderId": 1,
    "sku": "A",
    "quantity": 5,
    "warehouse": "Rome",
    "shippingCost": 4
  },
  {
    "orderId": 2,
    "sku": "A",
    "quantity": 12,
    "warehouse": "unavailable",
    "shippingCost": null
  },
  {
    "orderId": 3,
    "sku": "B",
    "quantity": 2,
    "warehouse": "Bologna",
    "shippingCost": 3
  },
  {
    "orderId": 4,
    "sku": "C",
    "quantity": 1,
    "warehouse": "unavailable",
    "shippingCost": null
  },
  {
    "orderId": 5,
    "sku": "A",
    "quantity": 4,
    "warehouse": "Paris",
    "shippingCost": 2
  }
]
```

The same output is available in [`expected.json`](expected.json). Field order and numeric formatting (`10` versus `10.0`) are not significant; document and array order are significant.  
Lo stesso output è disponibile in [`expected.json`](expected.json). L’ordine dei campi e il formato numerico (`10` oppure `10.0`) non sono significativi; l’ordine di documenti e array è significativo.

## Solution / Soluzione

Executable version / Versione eseguibile: [`solution.js`](solution.js).

```javascript
db.items.aggregate([
  { $match: { status: "pending" } },
  { $lookup: {
    from: "inventory", let: { sku: "$sku", country: "$country", needed: "$quantity" },
    pipeline: [
      { $match: { $expr: { $and: [
        { $eq: ["$sku", "$$sku"] }, { $eq: ["$country", "$$country"] },
        { $gte: ["$stock", "$$needed"] }
      ] } } },
      { $sort: { shippingCost: 1, _id: 1 } },
      { $limit: 1 },
      { $project: { _id: 0, warehouse: 1, shippingCost: 1 } }
    ], as: "allocation"
  } },
  { $unwind: { path: "$allocation", preserveNullAndEmptyArrays: true } },
  { $project: { _id: 0, orderId: "$_id", sku: 1, quantity: 1,
    warehouse: { $ifNull: ["$allocation.warehouse", "unavailable"] },
    shippingCost: { $ifNull: ["$allocation.shippingCost", null] } } },
  { $sort: { orderId: 1 } }
])
```

**English:** The limit belongs inside `$lookup`: choose one match per order. Equal costs are resolved by inventory `_id`; adequate stock in another country is not eligible.

**Italiano:** Il limite è interno a `$lookup`: seleziona una corrispondenza per ordine. A parità di costo decide `_id` di inventory; scorte sufficienti in un altro paese non sono idonee.
