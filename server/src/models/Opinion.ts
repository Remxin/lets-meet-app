import mongoose from "mongoose";

const opinionSchema = new mongoose.Schema({
  placeId: {
    type: String,
    required: true,
  },
  stars: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
  },
});

const Opinion = mongoose.model("opinion", opinionSchema);
module.exports = Opinion;
