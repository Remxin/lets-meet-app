import { timeStamp } from "console";
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
  }
}, {timestamps: true});

const Event = mongoose.model("event", eventSchema);
module.exports = Event;
