// Run setup.js first; see README.md.
db = db.getSiblingDB("aggregation_practice");
db.items.aggregate([
  { $match: { status: "paid" } },
  { $set: { subtotal: { $multiply: ["$quantity", "$unitPrice"] } } },
  { $set: { netTotal: { $round: [
    { $multiply: ["$subtotal", { $subtract: [1, { $divide: [{ $ifNull: ["$discountPct", 0] }, 100] }] }] }, 2
  ] } } },
  { $match: { netTotal: { $gte: 60 } } },
  { $sort: { netTotal: -1, _id: 1 } },
  { $project: { _id: 1, customer: 1, subtotal: 1, netTotal: 1 } }
]).forEach(doc => printjson(doc));
