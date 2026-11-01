# $text exercise

## Task

Find all articles whose `body` contains the word `bicycle` using `$text`. Create a text index on `body` before querying.

Use the `items` collection and load the documents from [`execise.json`](execise.json) with `insertMany()` before writing the query. Return the matching documents sorted by `_id` in ascending order.

## Setup

After inserting the data, create the required index with `db.items.createIndex({ body: "text" })`.

## Expected result

The query should return exactly these documents, in this order:

- `1` — City Rides
- `3` — Bike Repair
- `5` — Cycling Safety

## Solution

```javascript
db.items.createIndex({ body: "text" })

db.items.find({
  $text: { $search: "bicycle" }
}).sort({ _id: 1 })
```

The text index is required for `$text` to search the `body` field.
