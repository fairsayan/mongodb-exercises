# $lte exercise

## Task

Find all shipments with `deliveryDays` less than or equal to 3. Use `$lte`.

Use the `items` collection and load the documents from [`execise.json`](execise.json) with `insertMany()` before writing the query. Return the matching documents sorted by `_id` in ascending order.

## Expected result

The query should return exactly these documents, in this order:

- `1` — S-101
- `2` — S-102
- `5` — S-105
