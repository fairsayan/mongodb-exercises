# $in exercise

## Task

Find all customers whose `city` is either `Rome` or `Milan`. Use `$in`.

Use the `items` collection and load the documents from [`execise.json`](execise.json) with `insertMany()` before writing the query. Return the matching documents sorted by `_id` in ascending order.

## Expected result

The query should return exactly these documents, in this order:

- `1` — Ada
- `3` — Cleo
- `5` — Eva
