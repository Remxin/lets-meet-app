"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const citySchema = new mongoose_1.default.Schema({
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
});
const City = mongoose_1.default.model("city", citySchema);
module.exports = City;
