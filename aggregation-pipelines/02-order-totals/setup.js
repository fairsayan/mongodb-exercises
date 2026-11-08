// Run from the repository root with mongosh --file (see README.md).
// Uses the dedicated practice database. Replaces only the collections listed below.
db = db.getSiblingDB("aggregation_practice");
db.items.drop();
db.items.insertMany([
  {
    "_id": 1,
    "customer": "Ada",
    "status": "paid",
    "quantity": 2,
    "unitPrice": 40,
    "discountPct": 10
  },
  {
    "_id": 2,
    "customer": "Ben",
    "status": "paid",
    "quantity": 3,
    "unitPrice": 25
  },
  {
    "_id": 3,
    "customer": "Cleo",
    "status": "pending",
    "quantity": 5,
    "unitPrice": 100,
    "discountPct": 0
  },
  {
    "_id": 4,
    "customer": "Dan",
    "status": "paid",
    "quantity": 2,
    "unitPrice": 35,
    "discountPct": null
  },
  {
    "_id": 5,
    "customer": "Eva",
    "status": "paid",
    "quantity": 1,
    "unitPrice": 100,
    "discountPct": 50
  },
  {
    "_id": 6,
    "customer": "Finn",
    "status": "paid",
    "quantity": 3,
    "unitPrice": 19.99,
    "discountPct": 5
  }
]);
