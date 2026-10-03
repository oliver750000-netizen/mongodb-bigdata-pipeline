// Consulta 3.4 - Buscar "Great Location" en reseñas
const texto = "Great Location";

printjson(db.listingsAndReviews.aggregate([
  { $unwind: "$reviews" },
  { $match: { "reviews.comments": { $regex: texto, $options: "i" } } },
  { $project: {
      _id: 0, propiedad: "$name",
      reviewer: "$reviews.reviewer_name",
      comentario: "$reviews.comments"
  }},
  { $limit: 50 }
]).toArray());