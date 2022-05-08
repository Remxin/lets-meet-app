import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    localizationString: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        default: ""
    },

})

const Place = mongoose.model("place", placeSchema);
module.exports = Place;