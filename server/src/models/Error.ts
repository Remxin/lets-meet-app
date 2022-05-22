import { Schema, Model, Mongoose} from 'mongoose'

const errorSchema = new Schema({
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
    

}, {timestamps: true})