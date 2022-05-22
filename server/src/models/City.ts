import mongoose from "mongoose";

const citySchema = new mongoose.Schema({
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

const City = mongoose.model("city", citySchema);
module.exports = City;