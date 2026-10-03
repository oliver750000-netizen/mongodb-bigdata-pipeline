// Consulta 3.3 - Top 5 mejores revisores
const topN = 5;

printjson(db.listingsAndReviews.aggregate([
  { $unwind: "$reviews" },
  { $group: {
      _id: "$reviews.reviewer_id",
      reviewer_name: { $first: "$reviews.reviewer_name" },
      total_resenas: { $sum: 1 }
  }},
  { $sort: { total_resenas: -1 } },
  { $limit: topN },
  { $project: { _id: 0, reviewer_id: "$_id", reviewer_name: 1, total_resenas: 1 } }
]).toArray());