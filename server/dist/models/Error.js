"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const errorSchema = new mongoose_1.Schema({
    source: {
        type: "server" || "user reported",
        required: true
    },
    type: {
        type: String,
        required: true
    },
    text: {
        type: String
    }
}, { timestamps: true });
const Error = (0, mongoose_1.model)("error", errorSchema);
module.exports = Error;
