// Consulta 2.3 - Top 50 rutas más rentables (>70 vuelos)
printjson(db.flights.aggregate([
  { $group: {
      _id: { origen: "$origin_airport", destino: "$destination_airport" },
      total_vuelos: { $sum: 1 },
      total_pasajeros: { $sum: "$passengers_booked" },
      total_ganancias: { $sum: "$revenue" },
      promedio_ganancias_por_vuelo: { $avg: "$revenue" },
      promedio_load_factor: { $avg: "$load_factor_pct" }
  }},
  { $match: { total_vuelos: { $gt: 70 } } },
  { $sort: { total_ganancias: -1 } },
  { $limit: 50 },
  { $project: {
      _id: 0, origen: "$_id.origen", destino: "$_id.destino",
      total_vuelos: 1, total_pasajeros: 1,
      total_ganancias: { $round: ["$total_ganancias", 2] },
      promedio_ganancias_por_vuelo: { $round: ["$promedio_ganancias_por_vuelo", 2] },
      promedio_load_factor: { $round: ["$promedio_load_factor", 2] }
  }}
]).toArray());