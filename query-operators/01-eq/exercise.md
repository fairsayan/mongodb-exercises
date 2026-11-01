# $eq exercise

## Task

Find all orders whose `status` is exactly `shipped`. Use `$eq` explicitly.

Use the `items` collection and load the documents from [`execise.json`](execise.json) with `insertMany()` before writing the query. Return the matching documents sorted by `_id` in ascending order.

## Expected result

The query should return exactly these documents, in this order:

- `1` — Notebook
- `3` — Lamp
- `6` — Mouse

## Solution

```javascript
db.items.find({ status: { $eq: "shipped" } }).sort({ _id: 1 })
```

`$eq` matches orders whose status is exactly `shipped`.
