import mongoose from "mongoose";

const preferencesSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    language: {
        type: String,
        enum: ["pl", "en"]
        
    },
    chatSections: {
        type: Object,
        strict: false
    },
    country: {
        type: String,
        enum: ["Poland"]
    },
    cityId: {
        type: String
    }
});

const Preferences = mongoose.model("preferences", preferencesSchema);
// Preferences.create({userId: "629137870497f426ead39bab", language: "pl", chatSections: {myChatEvents: [], favourites: [], otherChats: ["625dab1aeefa984cdd541644"]}, country: "Poland", cityId: "6289f8b91e2315a05e7897e0"})
module.exports = Preferences;
