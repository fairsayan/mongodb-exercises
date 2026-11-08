# Aggregation pipelines / Pipeline di aggregation

Ten independent exercises with increasing difficulty. Use `aggregate()` throughout, rather than `find()`. Each exercise includes its own data, bilingual task, expected output, and solution. The whole series requires **MongoDB 5.0 or newer** and `mongosh` because the last exercise uses `$setWindowFields`.

Dieci esercizi indipendenti a difficoltà crescente. Usa sempre `aggregate()` anziché `find()`. Ogni esercizio contiene dati dedicati, consegna bilingue, risultato atteso e soluzione. L’intera serie richiede **MongoDB 5.0 o successivo** e `mongosh`, perché l’ultimo esercizio usa `$setWindowFields`.

## Files / File

- `execise.json`: valid JSON array to insert into `items`; the spelling follows the existing repository convention. / Array JSON valido da inserire in `items`; il nome segue la convenzione esistente.
- `customers.json`, `inventory.json`, or `products.json`: additional collection data for exercises 7, 8, and 10, respectively. / Dati delle collection aggiuntive rispettivamente per gli esercizi 7, 8 e 10.
- `setup.js`: ready-to-run data loader; embeds the same documents as the JSON files. / Caricamento eseguibile dei dati, identici a quelli dei file JSON.
- `exercise.md`: task in English and Italian, expected result, commented explanation, and solution. / Consegna in inglese e italiano, risultato atteso, spiegazione e soluzione.
- `solution.js`: executable reference pipeline. / Pipeline risolutiva eseguibile.
- `expected.json`: exact expected documents in output order. / Documenti attesi nell’ordine di restituzione.

## Run an exercise / Eseguire un esercizio

Run commands from the repository root, with a local MongoDB server running. For example: / Esegui i comandi dalla radice del repository, con MongoDB locale avviato. Per esempio:

```sh
mongosh --quiet --file aggregation-pipelines/01-product-catalog/setup.js
mongosh aggregation_practice
```

Read the task and write your pipeline in the shell. To run the reference solution afterward: / Leggi la consegna e scrivi la pipeline nella shell. Per eseguire successivamente la soluzione di riferimento:

```sh
mongosh --quiet --file aggregation-pipelines/01-product-catalog/solution.js
```

Replace the folder name to select another exercise. `setup.js` and `solution.js` select the `aggregation_practice` database explicitly. Setup **drops and reloads `items` and any supporting collections listed in that exercise**. Use this dedicated practice database only for disposable exercise data. Load setup again when switching exercises or after modifying the data. Pipelines themselves only read data.

Sostituisci il nome della cartella per scegliere un altro esercizio. `setup.js` e `solution.js` selezionano esplicitamente il database `aggregation_practice`. Il setup **elimina e ricarica `items` e le eventuali collection di supporto indicate nell’esercizio**. Usa questo database dedicato solo per dati didattici eliminabili. Riesegui il setup quando cambi esercizio o modifichi i dati. Le pipeline leggono soltanto i dati.

Alternatively, in `mongosh`, select a disposable database with `use aggregation_practice`, reset the relevant collections, and paste each JSON array into `db.<collection>.insertMany(...)`. Exercise 6 deliberately stores dates as strings and converts them inside its pipeline; exercise 10 also converts ISO strings before grouping.

In alternativa, in `mongosh` seleziona un database eliminabile con `use aggregation_practice`, svuota le collection interessate e incolla ogni array JSON in `db.<collection>.insertMany(...)`. L’esercizio 6 conserva volutamente le date come stringhe e le converte nella pipeline; anche l’esercizio 10 converte le stringhe ISO prima del raggruppamento.

## Verify all solutions / Verificare tutte le soluzioni

```sh
mongosh --quiet --file aggregation-pipelines/verify.js
```

Run from the repository root. This script loads the JSON datasets, runs all ten pipelines, and compares their output with `expected.json`, ignoring object key order. It uses a uniquely named temporary database (`aggregation_verify_<id>`) and removes it in a `finally` block. It does not use `aggregation_practice`. It requires permission to create and drop that temporary database. A failed comparison stops the script with an error; success prints ten `PASS` lines.

Esegui dalla radice del repository. Lo script carica i dataset JSON, esegue le dieci pipeline e confronta l’output con `expected.json`, ignorando l’ordine dei campi degli oggetti. Usa un database temporaneo dal nome univoco (`aggregation_verify_<id>`) e lo elimina in un blocco `finally`. Non usa `aggregation_practice`. Richiede i permessi per creare ed eliminare quel database temporaneo. Un confronto fallito interrompe lo script con un errore; in caso di successo stampa dieci righe `PASS`.

## References / Riferimenti

Official MongoDB documentation / Documentazione ufficiale MongoDB:

- [Aggregation pipelines](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/)
- [$lookup](https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/)
- [$facet](https://www.mongodb.com/docs/manual/reference/operator/aggregation/facet/)
- [$setWindowFields](https://www.mongodb.com/docs/manual/reference/operator/aggregation/setWindowFields/)
