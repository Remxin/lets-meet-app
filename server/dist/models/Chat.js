"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chatSchema = new mongoose_1.default.Schema({
    // eventId: {
    //   type: String,
    //   required: true
    // },
    organizatorId: {
        type: String,
        required: true,
    },
    members: {
        type: Array,
        default: [],
    },
    messages: {
        type: Array,
        default: [],
        /*
            [
                {
                    user: string (userName), userId: string (userId), text: string, timestamps: number
    
                }
            ]
            */
    },
    open: {
        type: Boolean,
        required: true,
    },
}, { timestamps: true });
const Chat = mongoose_1.default.model("chat", chatSchema);
module.exports = Chat;
