# $and exercise

## Task

Find all products that are both `active` (`status`) and in the `electronics` category. Use `$and` explicitly.

Use the `items` collection and load the documents from [`execise.json`](execise.json) with `insertMany()` before writing the query. Return the matching documents sorted by `_id` in ascending order.

## Expected result

The query should return exactly these documents, in this order:

- `1` — Tablet
- `3` — Radio
- `6` — Speaker

## Solution

```javascript
db.items.find({
  $and: [
    { status: "active" },
    { category: "electronics" }
  ]
}).sort({ _id: 1 })
```

`$and` requires both conditions to be true for the same product.
