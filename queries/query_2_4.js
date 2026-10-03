// Consulta 2.4 - Ranking aerolíneas por ingresos mensuales (Top 5)
printjson(db.flights.aggregate([
  { $group: {
      _id: { year: "$departure_year", month: "$departure_month", airline: "$airlinename" },
      total_vuelos: { $sum: 1 },
      total_pasajeros: { $sum: "$passengers_booked" },
      total_ganancias: { $sum: "$revenue" }
  }},
  { $sort: { "_id.year": 1, "_id.month": 1, total_ganancias: -1 } },
  { $group: {
      _id: { year: "$_id.year", month: "$_id.month" },
      aerolineas: { $push: {
        airline: "$_id.airline", total_vuelos: "$total_vuelos",
        total_pasajeros: "$total_pasajeros", total_ganancias: "$total_ganancias"
      }}
  }},
  { $project: { year: "$_id.year", month: "$_id.month", top5: { $slice: ["$aerolineas", 5] } } },
  { $unwind: { path: "$top5", includeArrayIndex: "posicion" } },
  { $project: {
      _id: 0, year: 1, month: 1,
      posicion: { $toInt: { $add: ["$posicion", 1] } },
      airline: "$top5.airline", total_vuelos: "$top5.total_vuelos",
      total_pasajeros: "$top5.total_pasajeros",
      total_ganancias: { $round: ["$top5.total_ganancias", 2] }
  }},
  { $sort: { year: 1, month: 1, posicion: 1 } },
  { $limit: 20 }
]).toArray());