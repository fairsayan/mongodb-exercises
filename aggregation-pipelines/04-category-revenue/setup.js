// Run from the repository root with mongosh --file (see README.md).
// Uses the dedicated practice database. Replaces only the collections listed below.
db = db.getSiblingDB("aggregation_practice");
db.items.drop();
db.items.insertMany([
  {
    "_id": 1,
    "status": "paid",
    "lines": [
      {
        "category": "books",
        "quantity": 2,
        "unitPrice": 15
      },
      {
        "category": "electronics",
        "quantity": 1,
        "unitPrice": 100
      },
      {
        "category": "books",
        "quantity": 1,
        "unitPrice": 20
      }
    ]
  },
  {
    "_id": 2,
    "status": "paid",
    "lines": [
      {
        "category": "books",
        "quantity": 3,
        "unitPrice": 10
      },
      {
        "category": "home",
        "quantity": 2,
        "unitPrice": 25
      }
    ]
  },
  {
    "_id": 3,
    "status": "paid",
    "lines": [
      {
        "category": "electronics",
        "quantity": 2,
        "unitPrice": 60
      }
    ]
  },
  {
    "_id": 4,
    "status": "cancelled",
    "lines": [
      {
        "category": "home",
        "quantity": 100,
        "unitPrice": 25
      }
    ]
  },
  {
    "_id": 5,
    "status": "paid",
    "lines": []
  },
  {
    "_id": 6,
    "status": "paid",
    "lines": null
  },
  {
    "_id": 7,
    "status": "paid"
  }
]);
