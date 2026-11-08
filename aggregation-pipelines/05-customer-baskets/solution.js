// Run setup.js first; see README.md.
db = db.getSiblingDB("aggregation_practice");
db.items.aggregate([
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
]).forEach(doc => printjson(doc));
