"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const eventSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Number,
        required: true
    },
    organizatorId: {
        type: String,
        required: true,
    },
    members: {
        type: Array,
        default: [],
    },
    premium: {
        type: Boolean,
        required: true,
    },
    public: {
        type: Boolean,
        required: true,
    },
    membersRestrictions: {
        type: Array,
    },
    place: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    chatId: {
        type: String,
    },
    maxMembers: {
        type: Number,
        default: -1
    },
    imageSrc: {
        type: String,
        default: ""
    }
}, { timestamps: true });
const Event = mongoose_1.default.model("event", eventSchema);
module.exports = Event;
