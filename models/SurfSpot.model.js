const { Schema, model } = require("mongoose");
const surfSpotSchema = new Schema({
  spotImage: {
    type: String,
    required: true,
  },
  beachName: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    enum: [
      "Denmark",
      "France",
      "Great Britain",
      "Greece",
      "Ireland",
      "Italy",
      "Netherlands",
      "Norway",
      "Portugal",
      "Spain",
    ],
    required: true,
  },
  mapLink: {
    type: String,
    required: true,
  },
  skillLevel: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    required: true,
  },
  spotDescription: {
    type: String,
    required: true,
  },
  accessibility: {
    type: String,
    required: true,
  },
  amenities: {
    type: String,
    enum: ["Showers", "Toilets", "None"],
    required: true,
  },
  foodSpots: {
    type: String,
    enum: ["Cafe", "Restaurant", "Supermarket", "Bar"],
    required: true,
  },
  rating: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
  },
  surfingType: {
    type: String,
    // syntax for multiple words in enum
    enum: ["Surfing", "Body Surfing", "Body Boarding"],
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const SurfSpot = model("SurfSpot", surfSpotSchema);
module.exports = SurfSpot;
