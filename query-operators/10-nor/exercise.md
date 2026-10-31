# $nor exercise

## Task

Find all products that are neither `discontinued` (`status`) nor in the `luxury` category. Use `$nor`.

Use the `items` collection and load the documents from [`execise.json`](execise.json) with `insertMany()` before writing the query. Return the matching documents sorted by `_id` in ascending order.

## Expected result

The query should return exactly these documents, in this order:

- `1` — Basic Chair
- `5` — Water Bottle
- `6` — Desk
