// Run setup.js first; see README.md.
db = db.getSiblingDB("aggregation_practice");
db.items.aggregate([
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
]).forEach(doc => printjson(doc));
