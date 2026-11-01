# $gte exercise

## Task

Find all courses with `rating` greater than or equal to 4.5. Use `$gte`.

Use the `items` collection and load the documents from [`execise.json`](execise.json) with `insertMany()` before writing the query. Return the matching documents sorted by `_id` in ascending order.

## Expected result

The query should return exactly these documents, in this order:

- `2` — Data Modeling
- `3` — Aggregation
- `5` — Replication

## Solution

```javascript
db.items.find({ rating: { $gte: 4.5 } }).sort({ _id: 1 })
```

`$gte` includes the course rated exactly `4.5`.
