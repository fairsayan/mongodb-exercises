// Run setup.js first; see README.md.
db = db.getSiblingDB("aggregation_practice");
db.items.aggregate([
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
]).forEach(doc => printjson(doc));
