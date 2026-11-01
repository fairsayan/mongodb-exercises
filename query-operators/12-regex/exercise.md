# $regex exercise

## Task

Find all products whose `name` starts with `Pro`, regardless of letter case. Use `$regex` with an anchored pattern and the case-insensitive option.

Use the `items` collection and load the documents from [`execise.json`](execise.json) with `insertMany()` before writing the query. Return the matching documents sorted by `_id` in ascending order.

## Expected result

The query should return exactly these documents, in this order:

- `1` — Projector
- `2` — protractor
- `3` — PRO Camera
- `5` — Profile Frame

## Solution

```javascript
db.items.find({
  name: { $regex: "^Pro", $options: "i" }
}).sort({ _id: 1 })
```

`^` anchors the pattern to the start of the name, and `i` makes it case-insensitive.
