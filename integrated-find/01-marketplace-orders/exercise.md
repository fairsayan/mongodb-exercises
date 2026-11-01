# Marketplace orders

## Task

Load [`execise.json`](execise.json) into the `items` collection with `insertMany()`.

Find **active** orders from customers in **Rome or Milan** whose `items` array contains **one line item** that is an `electronics` product with a quantity of at least `2`. The order's `total` must be greater than `100`. The category and quantity conditions must match the **same** line item.

Use `find()`. Sort by `total` descending and then `_id` ascending. Skip the first matching order and return the next two. Include only `_id`, `customer.name`, and `total` in each result.

## Richiesta in italiano

Carica [`execise.json`](execise.json) nella collection `items` usando `insertMany()`.

Trova gli ordini con `status` uguale a `active` effettuati da clienti di `Rome` o `Milan`, il cui array `items` contiene **un singolo elemento** con `category` uguale a `electronics` e `quantity` almeno pari a `2`. Il campo `total` dell'ordine deve essere maggiore di `100`. Le condizioni su `category` e `quantity` devono essere soddisfatte dallo **stesso elemento** dell'array.

Usa `find()`. Ordina per `total` decrescente e poi per `_id` crescente. Salta il primo ordine che soddisfa le condizioni e restituisci i due successivi. In ogni risultato includi soltanto `_id`, `customer.name` e `total`.

## Expected result

```json
[
  { "_id": 1, "customer": { "name": "Ada" }, "total": 180 },
  { "_id": 8, "customer": { "name": "Hana" }, "total": 160 }
]
```

Before pagination, the matching order IDs in sort order are `7, 1, 8, 3, 6`.

## Solution

```javascript
db.items.find(
  {
    status: "active",
    "customer.location.city": { $in: ["Rome", "Milan"] },
    items: {
      $elemMatch: {
        category: "electronics",
        quantity: { $gte: 2 }
      }
    },
    total: { $gt: 100 }
  },
  { _id: 1, "customer.name": 1, total: 1 }
).sort({ total: -1, _id: 1 }).skip(1).limit(2)
```

`$elemMatch` keeps the category and quantity conditions on the same item. Sorting happens before the first match is skipped.
