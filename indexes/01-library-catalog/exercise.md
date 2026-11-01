# Library catalog

## Task

Load [`execise.json`](execise.json) into the `items` collection with `insertMany()`. Create a text index on `summary` with `db.items.createIndex({ summary: "text" })`.

Use `find()` and `$text` to find available books whose `summary` mentions `MongoDB`. Also require a `rating` of at least `4.0`, an edition number below `3`, and at least one `metadata.topics` value of `queries` or `indexes`.

Sort by `rating` descending and then `_id` ascending. Skip the first matching book and return the next two. Include only `_id`, `title`, `rating`, and `metadata.edition` in each result.

## Richiesta in italiano

Carica [`execise.json`](execise.json) nella collection `items` usando `insertMany()`. Crea un indice testuale su `summary` con `db.items.createIndex({ summary: "text" })`.

Usa `find()` e `$text` per trovare i libri con `available` uguale a `true` il cui `summary` contiene `MongoDB`. Richiedi inoltre un `rating` di almeno `4.0`, un numero di `metadata.edition` inferiore a `3` e almeno un valore di `metadata.topics` uguale a `queries` o `indexes`.

Ordina per `rating` decrescente e poi per `_id` crescente. Salta il primo libro che soddisfa le condizioni e restituisci i due successivi. Includi solo `_id`, `title`, `rating` e `metadata.edition`.

## Expected result

```json
[
  { "_id": 1, "title": "MongoDB Essentials", "rating": 4.8, "metadata": { "edition": 1 } },
  { "_id": 3, "title": "Index Handbook", "rating": 4.6, "metadata": { "edition": 2 } }
]
```

Before pagination, the matching book IDs in sort order are `2, 1, 3, 8`.

## Solution

```javascript
db.items.createIndex({ summary: "text" })

db.items.find(
  {
    $text: { $search: "MongoDB" },
    available: true,
    rating: { $gte: 4.0 },
    "metadata.edition": { $lt: 3 },
    "metadata.topics": { $in: ["queries", "indexes"] }
  },
  { _id: 1, title: 1, rating: 1, "metadata.edition": 1 }
).sort({ rating: -1, _id: 1 }).skip(1).limit(2)
```

The text index is required before the `$text` query can run. The sort uses `rating`, with `_id` breaking ties.
