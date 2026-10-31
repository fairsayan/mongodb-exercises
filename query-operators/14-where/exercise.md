# $where exercise

## Task

Find all products for which `stock * unitPrice` is strictly greater than 100. Use `$where` with a JavaScript expression referring to each document as `this`.

Use the `items` collection and load the documents from [`execise.json`](execise.json) with `insertMany()` before writing the query. Return the matching documents sorted by `_id` in ascending order.

## Note

This exercise requires a MongoDB deployment with server-side JavaScript enabled.

## Expected result

The query should return exactly these documents, in this order:

- `2` — Mouse
- `3` — Keyboard
- `6` — Headset
