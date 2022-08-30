"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const opinionSchema = new mongoose_1.default.Schema({
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
const Opinion = mongoose_1.default.model("opinion", opinionSchema);
module.exports = Opinion;
