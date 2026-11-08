// Verifies all ten solutions using an isolated database; does not touch aggregation_practice.
// Run from repository root: mongosh --quiet --file aggregation-pipelines/verify.js
const fs = require("fs");
const assert = require("assert");
const verificationName = "aggregation_verify_" + new ObjectId().toHexString();
db = db.getSiblingDB(verificationName);
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value !== null && typeof value === "object") return Object.fromEntries(
    Object.keys(value).sort().map(key => [key, canonical(value[key])])
  );
  return value;
}
try {
  {
    db.items.drop();
    db.items.insertMany(JSON.parse(fs.readFileSync("aggregation-pipelines/01-product-catalog/execise.json", "utf8")));
    const actual = db.items.aggregate([
  { $match: { active: true, category: "electronics", price: { $gte: 50 } } },
  { $sort: { price: -1, _id: 1 } },
  { $limit: 3 },
  { $project: { _id: 1, name: 1, price: 1 } }
]).toArray();
    const expected = JSON.parse(fs.readFileSync("aggregation-pipelines/01-product-catalog/expected.json", "utf8"));
    assert.deepStrictEqual(canonical(JSON.parse(JSON.stringify(actual))), canonical(expected), "01-product-catalog");
    print("PASS 01-product-catalog");
  }
  {
    db.items.drop();
    db.items.insertMany(JSON.parse(fs.readFileSync("aggregation-pipelines/02-order-totals/execise.json", "utf8")));
    const actual = db.items.aggregate([
  { $match: { status: "paid" } },
  { $set: { subtotal: { $multiply: ["$quantity", "$unitPrice"] } } },
  { $set: { netTotal: { $round: [
    { $multiply: ["$subtotal", { $subtract: [1, { $divide: [{ $ifNull: ["$discountPct", 0] }, 100] }] }] }, 2
  ] } } },
  { $match: { netTotal: { $gte: 60 } } },
  { $sort: { netTotal: -1, _id: 1 } },
  { $project: { _id: 1, customer: 1, subtotal: 1, netTotal: 1 } }
]).toArray();
    const expected = JSON.parse(fs.readFileSync("aggregation-pipelines/02-order-totals/expected.json", "utf8"));
    assert.deepStrictEqual(canonical(JSON.parse(JSON.stringify(actual))), canonical(expected), "02-order-totals");
    print("PASS 02-order-totals");
  }
  {
    db.items.drop();
    db.items.insertMany(JSON.parse(fs.readFileSync("aggregation-pipelines/03-city-sales/execise.json", "utf8")));
    const actual = db.items.aggregate([
  { $match: { status: "paid" } },
  { $group: {
    _id: "$city", orderCount: { $sum: 1 }, revenue: { $sum: "$total" },
    averageOrder: { $avg: "$total" },
    largeOrders: { $sum: { $cond: [{ $gte: ["$total", 150] }, 1, 0] } }
  } },
  { $match: { orderCount: { $gte: 2 }, revenue: { $gte: 200 } } },
  { $project: { _id: 0, city: "$_id", orderCount: 1, revenue: 1,
    averageOrder: { $round: ["$averageOrder", 2] }, largeOrders: 1 } },
  { $sort: { revenue: -1, city: 1 } }
]).toArray();
    const expected = JSON.parse(fs.readFileSync("aggregation-pipelines/03-city-sales/expected.json", "utf8"));
    assert.deepStrictEqual(canonical(JSON.parse(JSON.stringify(actual))), canonical(expected), "03-city-sales");
    print("PASS 03-city-sales");
  }
  {
    db.items.drop();
    db.items.insertMany(JSON.parse(fs.readFileSync("aggregation-pipelines/04-category-revenue/execise.json", "utf8")));
    const actual = db.items.aggregate([
  { $match: { status: "paid" } },
  { $unwind: "$lines" },
  { $group: {
    _id: "$lines.category", units: { $sum: "$lines.quantity" },
    revenue: { $sum: { $multiply: ["$lines.quantity", "$lines.unitPrice"] } },
    orderIds: { $addToSet: "$_id" }
  } },
  { $project: { _id: 0, category: "$_id", units: 1, revenue: 1, orderCount: { $size: "$orderIds" } } },
  { $sort: { revenue: -1, category: 1 } }
]).toArray();
    const expected = JSON.parse(fs.readFileSync("aggregation-pipelines/04-category-revenue/expected.json", "utf8"));
    assert.deepStrictEqual(canonical(JSON.parse(JSON.stringify(actual))), canonical(expected), "04-category-revenue");
    print("PASS 04-category-revenue");
  }
  {
    db.items.drop();
    db.items.insertMany(JSON.parse(fs.readFileSync("aggregation-pipelines/05-customer-baskets/execise.json", "utf8")));
    const actual = db.items.aggregate([
  { $set: { selectedLines: { $map: {
    input: { $filter: {
      input: { $ifNull: ["$lines", []] }, as: "line",
      cond: { $and: [{ $eq: ["$$line.active", true] }, { $gt: ["$$line.quantity", 0] }] }
    } }, as: "line",
    in: { sku: "$$line.sku", lineTotal: { $multiply: ["$$line.quantity", "$$line.unitPrice"] } }
  } } } },
  { $set: { basketTotal: { $reduce: {
    input: "$selectedLines", initialValue: 0, in: { $add: ["$$value", "$$this.lineTotal"] }
  } } } },
  { $sort: { basketTotal: -1, _id: 1 } },
  { $project: { _id: 1, customer: 1, selectedLines: 1, basketTotal: 1 } }
]).toArray();
    const expected = JSON.parse(fs.readFileSync("aggregation-pipelines/05-customer-baskets/expected.json", "utf8"));
    assert.deepStrictEqual(canonical(JSON.parse(JSON.stringify(actual))), canonical(expected), "05-customer-baskets");
    print("PASS 05-customer-baskets");
  }
  {
    db.items.drop();
    db.items.insertMany(JSON.parse(fs.readFileSync("aggregation-pipelines/06-monthly-revenue/execise.json", "utf8")));
    const actual = db.items.aggregate([
  { $match: { status: "paid" } },
  { $set: { orderDate: { $convert: { input: "$orderedAt", to: "date", onError: null, onNull: null } } } },
  { $match: { orderDate: { $ne: null } } },
  { $group: {
    _id: { month: { $dateToString: { date: "$orderDate", format: "%Y-%m", timezone: "Europe/Rome" } }, channel: "$channel" },
    orderCount: { $sum: 1 }, revenue: { $sum: "$total" }
  } },
  { $project: { _id: 0, month: "$_id.month", channel: "$_id.channel", orderCount: 1, revenue: 1 } },
  { $sort: { month: 1, revenue: -1, channel: 1 } }
]).toArray();
    const expected = JSON.parse(fs.readFileSync("aggregation-pipelines/06-monthly-revenue/expected.json", "utf8"));
    assert.deepStrictEqual(canonical(JSON.parse(JSON.stringify(actual))), canonical(expected), "06-monthly-revenue");
    print("PASS 06-monthly-revenue");
  }
  {
    db.items.drop();
    db.items.insertMany(JSON.parse(fs.readFileSync("aggregation-pipelines/07-customer-orders/execise.json", "utf8")));
    db.customers.drop();
    db.customers.insertMany(JSON.parse(fs.readFileSync("aggregation-pipelines/07-customer-orders/customers.json", "utf8")));
    const actual = db.items.aggregate([
  { $match: { status: "paid" } },
  { $lookup: { from: "customers", localField: "customerId", foreignField: "_id", as: "customer" } },
  { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
  { $project: { _id: 0, orderId: "$_id", customerName: { $ifNull: ["$customer.name", "Unknown"] },
    city: { $ifNull: ["$customer.city", "N/A"] }, total: 1 } },
  { $sort: { total: -1, orderId: 1 } }
]).toArray();
    const expected = JSON.parse(fs.readFileSync("aggregation-pipelines/07-customer-orders/expected.json", "utf8"));
    assert.deepStrictEqual(canonical(JSON.parse(JSON.stringify(actual))), canonical(expected), "07-customer-orders");
    print("PASS 07-customer-orders");
  }
  {
    db.items.drop();
    db.items.insertMany(JSON.parse(fs.readFileSync("aggregation-pipelines/08-warehouse-allocation/execise.json", "utf8")));
    db.inventory.drop();
    db.inventory.insertMany(JSON.parse(fs.readFileSync("aggregation-pipelines/08-warehouse-allocation/inventory.json", "utf8")));
    const actual = db.items.aggregate([
  { $match: { status: "pending" } },
  { $lookup: {
    from: "inventory", let: { sku: "$sku", country: "$country", needed: "$quantity" },
    pipeline: [
      { $match: { $expr: { $and: [
        { $eq: ["$sku", "$$sku"] }, { $eq: ["$country", "$$country"] },
        { $gte: ["$stock", "$$needed"] }
      ] } } },
      { $sort: { shippingCost: 1, _id: 1 } },
      { $limit: 1 },
      { $project: { _id: 0, warehouse: 1, shippingCost: 1 } }
    ], as: "allocation"
  } },
  { $unwind: { path: "$allocation", preserveNullAndEmptyArrays: true } },
  { $project: { _id: 0, orderId: "$_id", sku: 1, quantity: 1,
    warehouse: { $ifNull: ["$allocation.warehouse", "unavailable"] },
    shippingCost: { $ifNull: ["$allocation.shippingCost", null] } } },
  { $sort: { orderId: 1 } }
]).toArray();
    const expected = JSON.parse(fs.readFileSync("aggregation-pipelines/08-warehouse-allocation/expected.json", "utf8"));
    assert.deepStrictEqual(canonical(JSON.parse(JSON.stringify(actual))), canonical(expected), "08-warehouse-allocation");
    print("PASS 08-warehouse-allocation");
  }
  {
    db.items.drop();
    db.items.insertMany(JSON.parse(fs.readFileSync("aggregation-pipelines/09-sales-dashboard/execise.json", "utf8")));
    const actual = db.items.aggregate([
  { $match: { status: "paid" } },
  { $facet: {
    summary: [
      { $group: { _id: null, orderCount: { $sum: 1 }, revenue: { $sum: "$total" }, averageOrder: { $avg: "$total" } } },
      { $project: { _id: 0, orderCount: 1, revenue: 1, averageOrder: { $round: ["$averageOrder", 2] } } }
    ],
    byCategory: [
      { $group: { _id: "$category", orderCount: { $sum: 1 }, revenue: { $sum: "$total" } } },
      { $project: { _id: 0, category: "$_id", orderCount: 1, revenue: 1 } },
      { $sort: { revenue: -1, category: 1 } }
    ],
    priceBands: [
      { $bucket: { groupBy: "$total", boundaries: [0, 50, 100, 200], default: "200+",
        output: { orderCount: { $sum: 1 }, revenue: { $sum: "$total" } } } },
      { $project: { _id: 0, band: "$_id", orderCount: 1, revenue: 1 } },
      { $sort: { band: 1 } }
    ],
    page: [
      { $sort: { total: -1, _id: 1 } }, { $skip: 2 }, { $limit: 2 },
      { $project: { _id: 1, category: 1, total: 1 } }
    ]
  } }
]).toArray();
    const expected = JSON.parse(fs.readFileSync("aggregation-pipelines/09-sales-dashboard/expected.json", "utf8"));
    assert.deepStrictEqual(canonical(JSON.parse(JSON.stringify(actual))), canonical(expected), "09-sales-dashboard");
    print("PASS 09-sales-dashboard");
  }
  {
    db.items.drop();
    db.items.insertMany(JSON.parse(fs.readFileSync("aggregation-pipelines/10-store-performance/execise.json", "utf8")));
    db.products.drop();
    db.products.insertMany(JSON.parse(fs.readFileSync("aggregation-pipelines/10-store-performance/products.json", "utf8")));
    const actual = db.items.aggregate([
  { $match: { status: "paid" } },
  { $unwind: "$lines" },
  { $lookup: { from: "products", localField: "lines.sku", foreignField: "sku", as: "product" } },
  { $unwind: "$product" },
  { $group: {
    _id: { store: "$store", day: { $dateToString: { date: { $toDate: "$orderedAt" }, format: "%Y-%m-%d", timezone: "UTC" } } },
    dailyRevenue: { $sum: { $multiply: ["$lines.quantity", "$product.unitPrice"] } },
    orderIds: { $addToSet: "$_id" }
  } },
  { $project: { _id: 0, store: "$_id.store", day: "$_id.day", dailyRevenue: 1, orderCount: { $size: "$orderIds" } } },
  { $setWindowFields: {
    partitionBy: "$store", sortBy: { day: 1 },
    output: {
      cumulativeRevenue: { $sum: "$dailyRevenue", window: { documents: ["unbounded", "current"] } },
      movingAverage: { $avg: "$dailyRevenue", window: { documents: [-1, 0] } }
    }
  } },
  { $setWindowFields: {
    partitionBy: "$store", sortBy: { dailyRevenue: -1 },
    output: { revenueRank: { $denseRank: {} } }
  } },
  { $set: { movingAverage: { $round: ["$movingAverage", 2] } } },
  { $sort: { store: 1, day: 1 } }
]).toArray();
    const expected = JSON.parse(fs.readFileSync("aggregation-pipelines/10-store-performance/expected.json", "utf8"));
    assert.deepStrictEqual(canonical(JSON.parse(JSON.stringify(actual))), canonical(expected), "10-store-performance");
    print("PASS 10-store-performance");
  }
} finally {
  db.dropDatabase();
}
