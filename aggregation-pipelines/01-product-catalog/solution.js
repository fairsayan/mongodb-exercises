// Run setup.js first; see README.md.
db = db.getSiblingDB("aggregation_practice");
db.items.aggregate([
  { $match: { active: true, category: "electronics", price: { $gte: 50 } } },
  { $sort: { price: -1, _id: 1 } },
  { $limit: 3 },
  { $project: { _id: 1, name: 1, price: 1 } }
]).forEach(doc => printjson(doc));
