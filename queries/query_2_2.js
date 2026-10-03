// Consulta 2.2 - Desempeño mensual de las aerolíneas
printjson(db.flights.aggregate([
  { $group: {
      _id: { year: "$departure_year", month: "$departure_month", airline: "$airlinename" },
      total_vuelos: { $sum: 1 },
      total_pasajeros: { $sum: "$passengers_booked" },
      total_ganancias: { $sum: "$revenue" },
      promedio_load_factor: { $avg: "$load_factor_pct" }
  }},
  { $sort: { "_id.year": 1, "_id.month": 1, total_ganancias: -1 } },
  { $project: {
      _id: 0,
      year: "$_id.year", month: "$_id.month", airline: "$_id.airline",
      total_vuelos: 1, total_pasajeros: 1,
      total_ganancias: { $round: ["$total_ganancias", 2] },
      promedio_load_factor: { $round: ["$promedio_load_factor", 2] }
  }},
  { $limit: 30 }
]).toArray());