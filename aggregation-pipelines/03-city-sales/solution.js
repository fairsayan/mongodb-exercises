// Run setup.js first; see README.md.
db = db.getSiblingDB("aggregation_practice");
db.items.aggregate([
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
]).forEach(doc => printjson(doc));
