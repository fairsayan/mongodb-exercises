// Run from the repository root with mongosh --file (see README.md).
// Uses the dedicated practice database. Replaces only the collections listed below.
db = db.getSiblingDB("aggregation_practice");
db.items.drop();
db.items.insertMany([
  {
    "_id": 1,
    "store": "Rome",
    "status": "paid",
    "orderedAt": "2025-03-01T10:00:00Z",
    "lines": [
      {
        "sku": "A",
        "quantity": 2
      },
      {
        "sku": "B",
        "quantity": 1
      }
    ]
  },
  {
    "_id": 2,
    "store": "Rome",
    "status": "paid",
    "orderedAt": "2025-03-01T12:00:00Z",
    "lines": [
      {
        "sku": "A",
        "quantity": 1
      },
      {
        "sku": "X",
        "quantity": 10
      }
    ]
  },
  {
    "_id": 3,
    "store": "Rome",
    "status": "paid",
    "orderedAt": "2025-03-02T10:00:00Z",
    "lines": [
      {
        "sku": "B",
        "quantity": 2
      }
    ]
  },
  {
    "_id": 4,
    "store": "Rome",
    "status": "paid",
    "orderedAt": "2025-03-04T10:00:00Z",
    "lines": [
      {
        "sku": "A",
        "quantity": 4
      },
      {
        "sku": "B",
        "quantity": 1
      }
    ]
  },
  {
    "_id": 5,
    "store": "Milan",
    "status": "paid",
    "orderedAt": "2025-03-01T10:00:00Z",
    "lines": [
      {
        "sku": "A",
        "quantity": 1
      }
    ]
  },
  {
    "_id": 6,
    "store": "Milan",
    "status": "paid",
    "orderedAt": "2025-03-03T10:00:00Z",
    "lines": [
      {
        "sku": "B",
        "quantity": 1
      }
    ]
  },
  {
    "_id": 7,
    "store": "Milan",
    "status": "paid",
    "orderedAt": "2025-03-04T10:00:00Z",
    "lines": [
      {
        "sku": "A",
        "quantity": 2
      }
    ]
  },
  {
    "_id": 8,
    "store": "Rome",
    "status": "cancelled",
    "orderedAt": "2025-03-02T11:00:00Z",
    "lines": [
      {
        "sku": "A",
        "quantity": 100
      }
    ]
  },
  {
    "_id": 9,
    "store": "Rome",
    "status": "paid",
    "orderedAt": "2025-03-03T10:00:00Z",
    "lines": [
      {
        "sku": "X",
        "quantity": 5
      }
    ]
  },
  {
    "_id": 10,
    "store": "Milan",
    "status": "paid",
    "orderedAt": "2025-03-02T10:00:00Z",
    "lines": []
  }
]);
db.products.drop();
db.products.insertMany([
  {
    "_id": 101,
    "sku": "A",
    "name": "Notebook",
    "unitPrice": 10
  },
  {
    "_id": 102,
    "sku": "B",
    "name": "Lamp",
    "unitPrice": 20
  },
  {
    "_id": 103,
    "sku": "C",
    "name": "Mouse",
    "unitPrice": 30
  }
]);
