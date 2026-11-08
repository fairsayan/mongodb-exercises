// Run from the repository root with mongosh --file (see README.md).
// Uses the dedicated practice database. Replaces only the collections listed below.
db = db.getSiblingDB("aggregation_practice");
db.items.drop();
db.items.insertMany([
  {
    "_id": 1,
    "customer": "Ada",
    "lines": [
      {
        "sku": "A",
        "active": true,
        "quantity": 2,
        "unitPrice": 20
      },
      {
        "sku": "B",
        "active": false,
        "quantity": 5,
        "unitPrice": 50
      },
      {
        "sku": "C",
        "active": true,
        "quantity": 3,
        "unitPrice": 10
      }
    ]
  },
  {
    "_id": 2,
    "customer": "Ben",
    "lines": []
  },
  {
    "_id": 3,
    "customer": "Cleo",
    "lines": null
  },
  {
    "_id": 4,
    "customer": "Dan"
  },
  {
    "_id": 5,
    "customer": "Eva",
    "lines": [
      {
        "sku": "D",
        "active": true,
        "quantity": 0,
        "unitPrice": 90
      },
      {
        "sku": "E",
        "active": true,
        "quantity": 1,
        "unitPrice": 100
      }
    ]
  },
  {
    "_id": 6,
    "customer": "Finn",
    "lines": [
      {
        "sku": "F",
        "active": false,
        "quantity": 1,
        "unitPrice": 40
      }
    ]
  }
]);
