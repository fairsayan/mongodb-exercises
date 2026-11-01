# Warehouse stock

## Task

Load [`execise.json`](execise.json) into the `items` collection with `insertMany()`.

Find **active** products stored in **Rome or Turin** with at least one bin in zone `A` containing a quantity of at least `3`. The zone and quantity conditions must match the **same** bin. Also require `stock - reserved` to be at least `5`; express this document-to-document calculation with `$where` and `this`.

Use only `find()` and cursor methods. Sort by `warehouse.city` ascending, `stock` descending, and `_id` ascending. Return the first three matches. Include only `_id`, `name`, `warehouse.city`, `stock`, and `reserved` in each result.

**Note:** This exercise requires a MongoDB deployment with server-side JavaScript enabled for `$where`. A local MongoDB installation includes this feature; `security.javascriptEnabled` defaults to `true`.

To check the local configuration, open the file used to start `mongod` (often `mongod.conf`). If you do not know its path, run `db.serverCmdLineOpts()` in `mongosh` and look at `parsed.config`. In the configuration file, `security.javascriptEnabled: true` (or an omitted setting) means enabled; `false` means disabled. Check that `argv` in the same command does not contain `--noscripting`. If needed, set the option as follows, remove `--noscripting`, and restart `mongod`:

```yaml
security:
  javascriptEnabled: true
```

MongoDB documentation: [configuration option](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.javascriptEnabled) and [server-side JavaScript](https://www.mongodb.com/docs/manual/core/server-side-javascript/).

## Richiesta in italiano

Carica [`execise.json`](execise.json) nella collection `items` usando `insertMany()`.

Trova i prodotti con `status` uguale a `active`, conservati a `Rome` o `Turin`, che hanno almeno un elemento di `warehouse.bins` con `zone` uguale a `A` e `quantity` almeno pari a `3`. Le condizioni su `zone` e `quantity` devono essere soddisfatte dallo **stesso elemento** dell'array. Richiedi inoltre che `stock - reserved` sia almeno `5`; esprimi questo calcolo tra campi del documento con `$where` e `this`.

Usa soltanto `find()` e i metodi del cursore. Ordina per `warehouse.city` crescente, `stock` decrescente e `_id` crescente. Restituisci i primi tre risultati. Includi solo `_id`, `name`, `warehouse.city`, `stock` e `reserved`.

**Nota:** Questo esercizio richiede un'istanza MongoDB con JavaScript lato server abilitato per `$where`. Un'installazione locale include questa funzionalità; il valore predefinito di `security.javascriptEnabled` è `true`.

Per controllare la configurazione locale, apri il file usato per avviare `mongod` (spesso `mongod.conf`). Se non conosci il percorso, esegui `db.serverCmdLineOpts()` in `mongosh` e leggi `parsed.config`. Nel file, `security.javascriptEnabled: true` (o l'assenza dell'opzione) significa che è abilitato; `false` significa che è disabilitato. Controlla inoltre che `argv` nello stesso comando non contenga `--noscripting`. Se necessario, imposta l'opzione come segue, rimuovi `--noscripting` e riavvia `mongod`:

```yaml
security:
  javascriptEnabled: true
```

Documentazione MongoDB: [opzione di configurazione](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.javascriptEnabled) e [JavaScript lato server](https://www.mongodb.com/docs/manual/core/server-side-javascript/).

## Expected result

```json
[
  { "_id": 1, "name": "Sensor", "warehouse": { "city": "Rome" }, "stock": 10, "reserved": 3 },
  { "_id": 7, "name": "Modem", "warehouse": { "city": "Rome" }, "stock": 5, "reserved": 0 },
  { "_id": 6, "name": "Hub", "warehouse": { "city": "Turin" }, "stock": 9, "reserved": 2 }
]
```

Before the limit, the matching product IDs in sort order are `1, 7, 6, 8`.

## Solution

```javascript
db.items.find(
  {
    status: "active",
    "warehouse.city": { $in: ["Rome", "Turin"] },
    "warehouse.bins": {
      $elemMatch: {
        zone: "A",
        quantity: { $gte: 3 }
      }
    },
    $where: "this.stock - this.reserved >= 5"
  },
  { _id: 1, name: 1, "warehouse.city": 1, stock: 1, reserved: 1 }
).sort({ "warehouse.city": 1, stock: -1, _id: 1 }).limit(3)
```

`$elemMatch` checks one bin at a time. `$where` compares two values from the same product document.
