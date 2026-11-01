# Service tickets

## Task

Load [`execise.json`](execise.json) into the `items` collection with `insertMany()`.

Find tickets for assets in the `North` region whose priority is **not** `low`. Exclude tickets that are `closed` **or** have any update with state `resolved`. Also require that `responseMinutes` is **not greater than 60**.

Use `find()`. Sort by `responseMinutes` ascending and then `_id` ascending. Skip the first match and return the next two. Include only `_id`, `title`, `responseMinutes`, and `asset.site.region` in each result.

## Richiesta in italiano

Carica [`execise.json`](execise.json) nella collection `items` usando `insertMany()`.

Trova i ticket relativi ad asset nella regione `North` con `priority` diversa da `low`. Escludi i ticket con `status` uguale a `closed` **oppure** con almeno un elemento di `updates` il cui `state` è `resolved`. Richiedi inoltre che `responseMinutes` **non sia maggiore di 60**.

Usa `find()`. Ordina per `responseMinutes` crescente e poi per `_id` crescente. Salta il primo risultato e restituisci i due successivi. Includi solo `_id`, `title`, `responseMinutes` e `asset.site.region`.

## Expected result

```json
[
  { "_id": 8, "title": "Firewall", "responseMinutes": 35, "asset": { "site": { "region": "North" } } },
  { "_id": 2, "title": "Printer", "responseMinutes": 45, "asset": { "site": { "region": "North" } } }
]
```

Before pagination, the matching ticket IDs in sort order are `1, 8, 2, 10, 5`.

## Solution

```javascript
db.items.find(
  {
    "asset.site.region": "North",
    priority: { $ne: "low" },
    $nor: [
      { status: "closed" },
      { "updates.state": "resolved" }
    ],
    responseMinutes: { $not: { $gt: 60 } }
  },
  { _id: 1, title: 1, responseMinutes: 1, "asset.site.region": 1 }
).sort({ responseMinutes: 1, _id: 1 }).skip(1).limit(2)
```

`$nor` removes a ticket if either exclusion condition matches. The dotted path checks every object in `updates`.
