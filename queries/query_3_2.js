// Consulta 3.2 - Anuncios con >5 comodidades y rating >90
const minAmenities = 5;
const minRating = 90;

printjson(db.listingsAndReviews.aggregate([
  { $match: {
      $expr: { $gt: [ { $size: "$amenities" }, minAmenities ] },
      "review_scores.review_scores_rating": { $gt: minRating }
  }},
  { $project: {
      _id: 0, name: 1, property_type: 1,
      num_amenities: { $size: "$amenities" },
      rating: "$review_scores.review_scores_rating"
  }},
  { $limit: 50 }
]).toArray());