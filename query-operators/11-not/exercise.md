# $not exercise

## Task

Find all products whose `price` is not greater than 50. Apply `$not` to a `$gt` condition.

Use the `items` collection and load the documents from [`execise.json`](execise.json) with `insertMany()` before writing the query. Return the matching documents sorted by `_id` in ascending order.

## Expected result

The query should return exactly these documents, in this order:

- `1` — Pen
- `2` — Notebook
- `4` — Lamp
- `6` — Cable

## Solution

```javascript
db.items.find({ price: { $not: { $gt: 50 } } }).sort({ _id: 1 })
```

`$not` negates the greater-than condition, so a price of `50` is included.
