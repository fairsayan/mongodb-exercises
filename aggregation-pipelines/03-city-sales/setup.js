// Run from the repository root with mongosh --file (see README.md).
// Uses the dedicated practice database. Replaces only the collections listed below.
db = db.getSiblingDB("aggregation_practice");
db.items.drop();
db.items.insertMany([
  {
    "_id": 1,
    "city": "Rome",
    "status": "paid",
    "total": 100
  },
  {
    "_id": 2,
    "city": "Rome",
    "status": "paid",
    "total": 200
  },
  {
    "_id": 3,
    "city": "Rome",
    "status": "paid",
    "total": 150
  },
  {
    "_id": 4,
    "city": "Milan",
    "status": "paid",
    "total": 80
  },
  {
    "_id": 5,
    "city": "Milan",
    "status": "paid",
    "total": 120
  },
  {
    "_id": 6,
    "city": "Turin",
    "status": "paid",
    "total": 500
  },
  {
    "_id": 7,
    "city": "Rome",
    "status": "cancelled",
    "total": 900
  },
  {
    "_id": 8,
    "city": "Naples",
    "status": "paid",
    "total": 40
  },
  {
    "_id": 9,
    "city": "Naples",
    "status": "paid",
    "total": 60
  }
]);
