import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  eventId: {
    type: String,
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
}, {timestamps: true});

const Chat = mongoose.model("chat", chatSchema);
module.exports = Chat;
