// Run setup.js first; see README.md.
db = db.getSiblingDB("aggregation_practice");
db.items.aggregate([
  { $match: { status: "paid" } },
  { $unwind: "$lines" },
  { $group: {
    _id: "$lines.category", units: { $sum: "$lines.quantity" },
    revenue: { $sum: { $multiply: ["$lines.quantity", "$lines.unitPrice"] } },
    orderIds: { $addToSet: "$_id" }
  } },
  { $project: { _id: 0, category: "$_id", units: 1, revenue: 1, orderCount: { $size: "$orderIds" } } },
  { $sort: { revenue: -1, category: 1 } }
]).forEach(doc => printjson(doc));
