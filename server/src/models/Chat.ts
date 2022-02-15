import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
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
                user: string, content: string
            }
        ]
        */
  },
  open: {
    type: Boolean,
    required: true,
  },
});

const Chat = mongoose.model("chat", chatSchema);
module.exports = Chat;
