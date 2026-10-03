const express = require("express");
const { getDB } = require("../config/db");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();
router.use(verifyToken);

// 2.1 - Top 3 aeropuertos origen/destino dado un país
router.get("/2-1/aeropuertos", async (req, res) => {
  try {
    const { pais } = req.query;
    if (!pais) return res.status(400).json({ error: "El parámetro 'pais' es obligatorio" });

    const db = getDB();

    const origen = await db.collection("flights").aggregate([
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
    ]).toArray();

    const destino = await db.collection("flights").aggregate([
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
    ]).toArray();

    res.json({ origen, destino });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2.2 - Desempeño mensual de las aerolíneas
router.get("/2-2/desempeno-mensual", async (req, res) => {
  try {
    const db = getDB();
    const data = await db.collection("flights").aggregate([
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
      { $limit: 50 }
    ]).toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2.3 - Top 50 rutas más rentables (>70 vuelos)
router.get("/2-3/rutas-rentables", async (req, res) => {
  try {
    const db = getDB();
    const data = await db.collection("flights").aggregate([
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
    ]).toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2.4 - Ranking de aerolíneas por ingresos mensuales (Top 5)
router.get("/2-4/ranking-mensual", async (req, res) => {
  try {
    const db = getDB();
    const data = await db.collection("flights").aggregate([
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
      { $sort: { year: 1, month: 1, posicion: 1 } }
    ]).toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3.1 - Precio medio por tipo de propiedad
router.get("/3-1/precio-por-tipo", async (req, res) => {
  try {
    const db = getDB();
    const data = await db.collection("listingsAndReviews").aggregate([
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
    ]).toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3.2 - Anuncios con >N comodidades y rating >M
router.get("/3-2/anuncios-filtrados", async (req, res) => {
  try {
    const minAmenities = parseInt(req.query.amenities) || 5;
    const minRating = parseFloat(req.query.rating) || 90;
    const db = getDB();

    const data = await db.collection("listingsAndReviews").aggregate([
      { $match: {
          $expr: { $gt: [ { $size: "$amenities" }, minAmenities ] },
          "review_scores.review_scores_rating": { $gt: minRating }
      }},
      { $project: {
          _id: 0, name: 1, property_type: 1,
          num_amenities: { $size: "$amenities" },
          rating: "$review_scores.review_scores_rating"
      }},
      { $limit: 100 }
    ]).toArray();

    res.json({ filtros: { minAmenities, minRating }, total: data.length, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3.3 - Top N mejores revisores
router.get("/3-3/top-revisores", async (req, res) => {
  try {
    const topN = parseInt(req.query.top) || 5;
    const db = getDB();

    const data = await db.collection("listingsAndReviews").aggregate([
      { $unwind: "$reviews" },
      { $group: {
          _id: "$reviews.reviewer_id",
          reviewer_name: { $first: "$reviews.reviewer_name" },
          total_resenas: { $sum: 1 }
      }},
      { $sort: { total_resenas: -1 } },
      { $limit: topN },
      { $project: { _id: 0, reviewer_id: "$_id", reviewer_name: 1, total_resenas: 1 } }
    ]).toArray();

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3.4 - Buscar texto en reseñas
router.get("/3-4/buscar-en-resenas", async (req, res) => {
  try {
    const texto = req.query.q || "Great Location";
    const db = getDB();

    const data = await db.collection("listingsAndReviews").aggregate([
      { $unwind: "$reviews" },
      { $match: { "reviews.comments": { $regex: texto, $options: "i" } } },
      { $project: {
          _id: 0, propiedad: "$name",
          reviewer: "$reviews.reviewer_name",
          comentario: "$reviews.comments"
      }},
      { $limit: 100 }
    ]).toArray();

    res.json({ texto_buscado: texto, total: data.length, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;