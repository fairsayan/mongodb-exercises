// Run from the repository root with mongosh --file (see README.md).
// Uses the dedicated practice database. Replaces only the collections listed below.
db = db.getSiblingDB("aggregation_practice");
db.items.drop();
db.items.insertMany([
  {
    "_id": 1,
    "status": "paid",
    "channel": "web",
    "orderedAt": "2025-01-31T23:30:00Z",
    "total": 100
  },
  {
    "_id": 2,
    "status": "paid",
    "channel": "web",
    "orderedAt": "2025-02-10T10:00:00Z",
    "total": 60
  },
  {
    "_id": 3,
    "status": "paid",
    "channel": "store",
    "orderedAt": "2025-02-28T23:30:00Z",
    "total": 90
  },
  {
    "_id": 4,
    "status": "paid",
    "channel": "store",
    "orderedAt": "2025-02-15T12:00:00Z",
    "total": 50
  },
  {
    "_id": 5,
    "status": "paid",
    "channel": "web",
    "orderedAt": "2025-01-10T12:00:00Z",
    "total": 40
  },
  {
    "_id": 6,
    "status": "paid",
    "channel": "web",
    "orderedAt": "invalid",
    "total": 900
  },
  {
    "_id": 7,
    "status": "paid",
    "channel": "store",
    "orderedAt": null,
    "total": 800
  },
  {
    "_id": 8,
    "status": "cancelled",
    "channel": "web",
    "orderedAt": "2025-02-01T12:00:00Z",
    "total": 700
  },
  {
    "_id": 9,
    "status": "paid",
    "channel": "web",
    "total": 600
  }
]);
