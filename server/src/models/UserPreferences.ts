import mongoose from "mongoose";

const preferencesSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    language: {
        type: "pl" || "en"
    },
    chatSections: {
        myChatEvents: {
            type: []
        },
        favourites: {
            type: []
        },
        otherChats: {
            type: []
        }
    },
    country: {
        type: "Poland",
    },
    cityId: {
        type: String
    }
});

const Preferences = mongoose.model("chat", preferencesSchema);
module.exports = Preferences;
