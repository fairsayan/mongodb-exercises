# $ne exercise

## Task

Find all products whose `category` is not `book`. Use `$ne`.

Use the `items` collection and load the documents from [`execise.json`](execise.json) with `insertMany()` before writing the query. Return the matching documents sorted by `_id` in ascending order.

## Expected result

The query should return exactly these documents, in this order:

- `2` — Pen
- `4` — Cup
- `5` — Folder
- `6` — Plate

## Solution

```javascript
db.items.find({ category: { $ne: "book" } }).sort({ _id: 1 })
```

`$ne` excludes products in the `book` category.
