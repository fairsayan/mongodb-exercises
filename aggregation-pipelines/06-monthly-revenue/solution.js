// Run setup.js first; see README.md.
db = db.getSiblingDB("aggregation_practice");
db.items.aggregate([
  { $match: { status: "paid" } },
  { $set: { orderDate: { $convert: { input: "$orderedAt", to: "date", onError: null, onNull: null } } } },
  { $match: { orderDate: { $ne: null } } },
  { $group: {
    _id: { month: { $dateToString: { date: "$orderDate", format: "%Y-%m", timezone: "Europe/Rome" } }, channel: "$channel" },
    orderCount: { $sum: 1 }, revenue: { $sum: "$total" }
  } },
  { $project: { _id: 0, month: "$_id.month", channel: "$_id.channel", orderCount: 1, revenue: 1 } },
  { $sort: { month: 1, revenue: -1, channel: 1 } }
]).forEach(doc => printjson(doc));
