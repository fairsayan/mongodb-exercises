# $lt exercise

## Task

Find all products with `price` strictly less than 25. Use `$lt`.

Use the `items` collection and load the documents from [`execise.json`](execise.json) with `insertMany()` before writing the query. Return the matching documents sorted by `_id` in ascending order.

## Expected result

The query should return exactly these documents, in this order:

- `1` — Eraser
- `2` — Notebook
- `5` — Marker

## Solution

```javascript
db.items.find({ price: { $lt: 25 } }).sort({ _id: 1 })
```

`$lt` excludes the product priced exactly `25`.
