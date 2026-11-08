// Run setup.js first; see README.md.
db = db.getSiblingDB("aggregation_practice");
db.items.aggregate([
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
]).forEach(doc => printjson(doc));
