import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  addressString: {
    type: String
  },
  localizationString: {
    type: String,
    required: true,
  },
  premium: {
    type: Boolean,
    default: false,
  },
  website: {
    type: String,
    default: "",
  },
  description: {
    type: String,
  },
  opinionStars: {
    type: Number,
    default: -1,
  },
  userId: {
    // początkowo id usera, który to dodał, potem profil oficjalny miejsca
    type: String,
    default: "",
  },
  verified: {
    type: Boolean,
    default: false,
  },

  cityId: {
    required: true,
    type: String
  },

});

const Place = mongoose.model("place", placeSchema);
module.exports = Place;
