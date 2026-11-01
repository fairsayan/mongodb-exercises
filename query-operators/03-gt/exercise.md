# $gt exercise

## Task

Find all products with `stock` strictly greater than 10. Use `$gt`.

Use the `items` collection and load the documents from [`execise.json`](execise.json) with `insertMany()` before writing the query. Return the matching documents sorted by `_id` in ascending order.

## Expected result

The query should return exactly these documents, in this order:

- `3` — Keyboard
- `4` — Monitor
- `6` — Webcam

## Solution

```javascript
db.items.find({ stock: { $gt: 10 } }).sort({ _id: 1 })
```

`$gt` excludes the product whose stock is exactly `10`.
