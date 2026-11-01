# $where exercise

## Task

Find all products for which `stock * unitPrice` is strictly greater than 100. Use `$where` with a JavaScript expression referring to each document as `this`.

Use the `items` collection and load the documents from [`execise.json`](execise.json) with `insertMany()` before writing the query. Return the matching documents sorted by `_id` in ascending order.

## Note

This exercise requires a MongoDB deployment with server-side JavaScript enabled. A local MongoDB installation includes this feature; `security.javascriptEnabled` defaults to `true`.

To check the configuration of your local `mongod`:

1. Open the configuration file used to start `mongod` (often `mongod.conf`). If you do not know its path, connect with `mongosh` and run `db.serverCmdLineOpts()`; the `parsed.config` field shows the path when a configuration file is used.
2. In the configuration file, look for `security.javascriptEnabled`. It is enabled if set to `true` or omitted (the default), and disabled if set to `false`. Also check that `argv` in `db.serverCmdLineOpts()` does not contain `--noscripting`.
3. If disabled, set the option in the configuration file as shown below, remove `--noscripting` if present, and restart `mongod`:

   ```yaml
   security:
     javascriptEnabled: true
   ```

See the MongoDB documentation for [the configuration option](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.javascriptEnabled) and [server-side JavaScript](https://www.mongodb.com/docs/manual/core/server-side-javascript/).

## Expected result

The query should return exactly these documents, in this order:

- `2` — Mouse
- `3` — Keyboard
- `6` — Headset

## Solution

```javascript
db.items.find({
  $where: "this.stock * this.unitPrice > 100"
}).sort({ _id: 1 })
```

`$where` evaluates the expression for each product document; the product equal to `100` is excluded.
