# Hotel bookings

## Task

Load [`execise.json`](execise.json) into the `items` collection with `insertMany()`.

Find bookings with `status` equal to `confirmed` for stays in `Rome` or `Turin`. The stay must last at least `3` nights and have a `total` of at most `600`. The guest's `preferences` array must contain `quiet`, and the room's `amenities` array must contain **both** `wifi` and `breakfast`.

Use `find()`. Sort by `stay.total` ascending and then `_id` ascending. Skip the first matching booking and return the next two. Include only `_id`, `guest.name`, `stay.city`, and `stay.total` in each result.

## Richiesta in italiano

Carica [`execise.json`](execise.json) nella collection `items` usando `insertMany()`.

Trova le prenotazioni con `status` uguale a `confirmed` per soggiorni a `Rome` o `Turin`. Il soggiorno deve durare almeno `3` notti e avere un `total` non superiore a `600`. L'array `guest.preferences` deve contenere `quiet` e l'array `stay.room.amenities` deve contenere **sia** `wifi` **sia** `breakfast`.

Usa `find()`. Ordina per `stay.total` crescente e poi per `_id` crescente. Salta la prima prenotazione che soddisfa le condizioni e restituisci le due successive. Includi solo `_id`, `guest.name`, `stay.city` e `stay.total`.

## Expected result

```json
[
  { "_id": 2, "guest": { "name": "Omar" }, "stay": { "city": "Turin", "total": 360 } },
  { "_id": 9, "guest": { "name": "Vera" }, "stay": { "city": "Rome", "total": 360 } }
]
```

Before pagination, the matching booking IDs in sort order are `7, 2, 9, 1, 11`.

## Solution

```javascript
db.items.find(
  {
    status: "confirmed",
    "stay.city": { $in: ["Rome", "Turin"] },
    "stay.nights": { $gte: 3 },
    "stay.total": { $lte: 600 },
    "guest.preferences": "quiet",
    "stay.room.amenities": { $all: ["wifi", "breakfast"] }
  },
  { _id: 1, "guest.name": 1, "stay.city": 1, "stay.total": 1 }
).sort({ "stay.total": 1, _id: 1 }).skip(1).limit(2)
```

`$all` requires both amenities in the same array. `_id` makes the order deterministic when two bookings have the same `stay.total`.
