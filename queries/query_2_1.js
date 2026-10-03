// Consulta 2.1 - Top 3 aeropuertos origen/destino dado un país
const pais = "SPAIN";

print("=== TOP 3 AEROPUERTOS ORIGEN desde " + pais + " ===");
printjson(db.flights.aggregate([
  { $match: { origin_country: pais } },
  { $group: {
      _id: { aeropuerto: "$origin_airport", pais: "$origin_country" },
      total_vuelos: { $sum: 1 },
      total_pasajeros: { $sum: "$passengers_booked" }
  }},
  { $sort: { total_vuelos: -1 } },
  { $limit: 3 },
  { $project: {
      _id: 0, pais: "$_id.pais", aeropuerto: "$_id.aeropuerto",
      total_pasajeros: 1, total_vuelos: 1
  }}
]).toArray());

print("\n=== TOP 3 AEROPUERTOS DESTINO hacia " + pais + " ===");
printjson(db.flights.aggregate([
  { $match: { destination_country: pais } },
  { $group: {
      _id: { aeropuerto: "$destination_airport", pais: "$destination_country" },
      total_vuelos: { $sum: 1 },
      total_pasajeros: { $sum: "$passengers_booked" }
  }},
  { $sort: { total_vuelos: -1 } },
  { $limit: 3 },
  { $project: {
      _id: 0, pais: "$_id.pais", aeropuerto: "$_id.aeropuerto",
      total_pasajeros: 1, total_vuelos: 1
  }}
]).toArray());