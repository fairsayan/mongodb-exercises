// Run from the repository root with mongosh --file (see README.md).
// Uses the dedicated practice database. Replaces only the collections listed below.
db = db.getSiblingDB("aggregation_practice");
db.items.drop();
db.items.insertMany([
  {
    "_id": 1,
    "status": "paid",
    "category": "books",
    "total": 40
  },
  {
    "_id": 2,
    "status": "paid",
    "category": "books",
    "total": 60
  },
  {
    "_id": 3,
    "status": "paid",
    "category": "electronics",
    "total": 100
  },
  {
    "_id": 4,
    "status": "paid",
    "category": "electronics",
    "total": 200
  },
  {
    "_id": 5,
    "status": "paid",
    "category": "home",
    "total": 50
  },
  {
    "_id": 6,
    "status": "paid",
    "category": "home",
    "total": 250
  },
  {
    "_id": 7,
    "status": "cancelled",
    "category": "electronics",
    "total": 999
  },
  {
    "_id": 8,
    "status": "pending",
    "category": "books",
    "total": 10
  }
]);
