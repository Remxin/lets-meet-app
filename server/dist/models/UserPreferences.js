"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const preferencesSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true
    },
    language: {
        type: String,
        enum: ["pl", "en"],
        default: "en"
    },
    chatSections: {
        type: Array,
        default: [{ name: "my events chats", chats: [] }, { name: "other", chats: [] }, { name: "favourites", chats: [] }]
    },
    country: {
        type: String,
        enum: ["", "Poland"],
        default: ""
    },
    cityId: {
        type: String,
        default: ""
    }
});
const Preferences = mongoose_1.default.model("preferences", preferencesSchema);
// Preferences.create({userId: "629137870497f426ead39bab", language: "pl", chatSections: {myChatEvents: [], favourites: [], otherChats: ["625dab1aeefa984cdd541644"]}, country: "Poland", cityId: "6289f8b91e2315a05e7897e0"})
module.exports = Preferences;
