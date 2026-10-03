// Consulta 3.1 - Precio medio por tipo de propiedad
printjson(db.listingsAndReviews.aggregate([
  { $group: {
      _id: "$property_type",
      precio_promedio: { $avg: { $toDouble: "$price" } },
      total_listings: { $sum: 1 }
  }},
  { $sort: { total_listings: -1 } },
  { $project: {
      _id: 0, property_type: "$_id",
      precio_promedio: { $round: ["$precio_promedio", 2] },
      total_listings: 1
  }}
]).toArray());