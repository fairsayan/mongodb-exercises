// Run setup.js first; see README.md.
db = db.getSiblingDB("aggregation_practice");
db.items.aggregate([
  { $match: { status: "paid" } },
  { $lookup: { from: "customers", localField: "customerId", foreignField: "_id", as: "customer" } },
  { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
  { $project: { _id: 0, orderId: "$_id", customerName: { $ifNull: ["$customer.name", "Unknown"] },
    city: { $ifNull: ["$customer.city", "N/A"] }, total: 1 } },
  { $sort: { total: -1, orderId: 1 } }
]).forEach(doc => printjson(doc));
