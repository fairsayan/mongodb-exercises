// Run from the repository root with mongosh --file (see README.md).
// Uses the dedicated practice database. Replaces only the collections listed below.
db = db.getSiblingDB("aggregation_practice");
db.items.drop();
db.items.insertMany([
  {
    "_id": 1,
    "sku": "A",
    "quantity": 5,
    "country": "IT",
    "status": "pending"
  },
  {
    "_id": 2,
    "sku": "A",
    "quantity": 12,
    "country": "IT",
    "status": "pending"
  },
  {
    "_id": 3,
    "sku": "B",
    "quantity": 2,
    "country": "IT",
    "status": "pending"
  },
  {
    "_id": 4,
    "sku": "C",
    "quantity": 1,
    "country": "IT",
    "status": "pending"
  },
  {
    "_id": 5,
    "sku": "A",
    "quantity": 4,
    "country": "FR",
    "status": "pending"
  },
  {
    "_id": 6,
    "sku": "A",
    "quantity": 1,
    "country": "IT",
    "status": "shipped"
  }
]);
db.inventory.drop();
db.inventory.insertMany([
  {
    "_id": 1,
    "sku": "A",
    "country": "IT",
    "warehouse": "Rome",
    "stock": 8,
    "shippingCost": 4
  },
  {
    "_id": 2,
    "sku": "A",
    "country": "IT",
    "warehouse": "Milan",
    "stock": 10,
    "shippingCost": 4
  },
  {
    "_id": 3,
    "sku": "A",
    "country": "IT",
    "warehouse": "Turin",
    "stock": 3,
    "shippingCost": 1
  },
  {
    "_id": 4,
    "sku": "A",
    "country": "FR",
    "warehouse": "Paris",
    "stock": 50,
    "shippingCost": 2
  },
  {
    "_id": 5,
    "sku": "B",
    "country": "IT",
    "warehouse": "Bologna",
    "stock": 2,
    "shippingCost": 3
  },
  {
    "_id": 6,
    "sku": "B",
    "country": "IT",
    "warehouse": "Genoa",
    "stock": 5,
    "shippingCost": 6
  }
]);
