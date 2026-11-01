# City events

## Task

Load [`execise.json`](execise.json) into the `items` collection with `insertMany()`.

Find events in **Rome** that are **not cancelled** and cost **less than 50**. An event must also meet at least one of these conditions:

- It is a `workshop` with at most `20` available seats.
- Its title starts with `Data`, regardless of letter case.

Sort by `startDay` ascending, then `_id` ascending, and return only the first three matches. Include only `_id`, `title`, `startDay`, and `venue.address.city` in each result.

## Richiesta in italiano

Carica [`execise.json`](execise.json) nella collection `items` usando `insertMany()`.

Trova gli eventi che si svolgono a `Rome`, hanno `status` diverso da `cancelled` e `price` inferiore a `50`. Ogni evento deve inoltre soddisfare almeno una di queste condizioni:

- Ha `type` uguale a `workshop` e non più di `20` posti disponibili nel campo `seats`.
- Il suo `title` inizia con `Data`, senza distinguere tra maiuscole e minuscole.

Ordina per `startDay` crescente e poi per `_id` crescente, quindi restituisci soltanto i primi tre risultati. Includi solo `_id`, `title`, `startDay` e `venue.address.city`.

## Expected result

```json
[
  { "_id": 7, "title": "Data Architecture", "startDay": 8, "venue": { "address": { "city": "Rome" } } },
  { "_id": 2, "title": "Workshop Queries", "startDay": 10, "venue": { "address": { "city": "Rome" } } },
  { "_id": 1, "title": "Data Modeling", "startDay": 12, "venue": { "address": { "city": "Rome" } } }
]
```

Before the limit, the matching event IDs in sort order are `7, 2, 1, 6, 9`.

## Solution

```javascript
db.items.find(
  {
    "venue.address.city": "Rome",
    status: { $ne: "cancelled" },
    price: { $lt: 50 },
    $or: [
      { type: "workshop", seats: { $lte: 20 } },
      { title: { $regex: "^Data", $options: "i" } }
    ]
  },
  { _id: 1, title: 1, startDay: 1, "venue.address.city": 1 }
).sort({ startDay: 1, _id: 1 }).limit(3)
```

The anchored regular expression matches titles that begin with `Data`, regardless of case.
