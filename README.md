# MongoDB Exercises

This repository contains hands-on MongoDB exercises.

## How to use an exercise

1. Open an exercise folder and read `exercise.md`.
2. Copy the entire JSON array from `execise.json` and paste it into `db.items.insertMany(...)` in `mongosh`, replacing `...` with the array. Use a fresh database or run `db.items.drop()` before loading another exercise.
3. Write a `db.items.find(...)` query that uses the named operator. Sort the result by `_id` ascending to compare it with the expected result.
4. For the `$text` exercise, create the text index specified in its instructions after inserting the data. The `$where` exercise requires server-side JavaScript to be enabled.

Each `execise.json` file is a valid JSON array. The filename is intentionally spelled `execise.json` to match the exercise file convention used in this repository.
