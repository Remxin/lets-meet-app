import mongoose from "mongoose";

const joinRequestSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },

    eventId: {
        type: String,
        required: true
    },

    accepted: {
        type: Boolean,
        default: false
    }

}, {timestamps: true});

const JoinRequest = mongoose.model("joinRequest", joinRequestSchema);
module.exports = JoinRequest;
