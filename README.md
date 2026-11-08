# MongoDB Exercises

This repository contains hands-on MongoDB exercises. The `query-operators` folder has one exercise per query operator. The `integrated-find` folder has five exercises that combine filters on nested documents and arrays with sorting, pagination, and projections. These two folders use `find()`. The `aggregation-pipelines` folder adds ten bilingual exercises with progressively harder aggregation pipelines, datasets, expected results, and executable solutions.

## How to use a find exercise

1. Open an exercise folder and read `exercise.md`.
2. Copy the entire JSON array from `execise.json` and paste it into `db.items.insertMany(...)` in `mongosh`, replacing `...` with the array. Use a fresh database or run `db.items.drop()` before loading another exercise.
3. Write a `db.items.find(...)` query. Follow the sorting, `skip()`, `limit()`, and projection instructions in the exercise, then compare the output with the expected result.
4. For exercises using `$text`, create the text index specified in their instructions after inserting the data. Exercises using `$where` require server-side JavaScript to be enabled.

Each `execise.json` file is a valid JSON array. The filename is intentionally spelled `execise.json` to match the exercise file convention used in this repository.

## Integrated find exercises

1. [Marketplace orders](integrated-find/01-marketplace-orders/exercise.md) — nested customers, array elements, sorting, pagination, and projection.
2. [City events](integrated-find/02-city-events/exercise.md) — nested venues, logical conditions, regular expressions, sorting, and projection.
3. [Service tickets](integrated-find/03-service-tickets/exercise.md) — nested assets, arrays of updates, exclusions, pagination, and projection.
4. [Hotel bookings](integrated-find/04-hotel-bookings/exercise.md) — nested rooms, array values, range filters, pagination, and projection.
5. [Warehouse stock](integrated-find/05-warehouse-stock/exercise.md) — arrays of bins, calculated conditions, sorting, and projection.

## Index exercises

The [first index exercise](indexes/01-library-catalog/exercise.md) covers text search and creating the text index it requires. Work through it when the course reaches indexes.

## Aggregation pipeline exercises

The [aggregation learning path](aggregation-pipelines/README.md) contains ten exercises with English and Italian tasks, from filtering and projections to joins, faceted reports, and window calculations. Each folder includes `execise.json`, `exercise.md`, `setup.js`, `solution.js`, and `expected.json`; join exercises also include supporting collection datasets. Follow the series README for setup and verification instructions. MongoDB 5.0 or newer and `mongosh` are required for the full series.
