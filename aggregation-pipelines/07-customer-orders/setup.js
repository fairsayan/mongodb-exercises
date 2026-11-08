// Run from the repository root with mongosh --file (see README.md).
// Uses the dedicated practice database. Replaces only the collections listed below.
db = db.getSiblingDB("aggregation_practice");
db.items.drop();
db.items.insertMany([
  {
    "_id": 1,
    "customerId": 101,
    "status": "paid",
    "total": 90
  },
  {
    "_id": 2,
    "customerId": 102,
    "status": "paid",
    "total": 120
  },
  {
    "_id": 3,
    "customerId": 999,
    "status": "paid",
    "total": 70
  },
  {
    "_id": 4,
    "customerId": 103,
    "status": "cancelled",
    "total": 500
  },
  {
    "_id": 5,
    "customerId": 101,
    "status": "paid",
    "total": 30
  },
  {
    "_id": 6,
    "status": "paid",
    "total": 40
  }
]);
db.customers.drop();
db.customers.insertMany([
  {
    "_id": 101,
    "name": "Ada",
    "city": "Rome"
  },
  {
    "_id": 102,
    "name": "Ben",
    "city": null
  },
  {
    "_id": 103,
    "name": "Cleo",
    "city": "Milan"
  },
  {
    "_id": 104,
    "name": "Dan",
    "city": "Turin"
  }
]);
