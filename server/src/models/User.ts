import mongoose from "mongoose";
import { NextFunction } from "express";
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter your name"],
  },
  email: {
    type: String,
    required: [true, "Enter your email"],
    unique: true,
    validate: [isEmail, "Enter a valid email address"],
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Enter password"],
    minlength: [6, "Password should be at least 6 characters long"],
  },
  sex: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  myEventsId: {
    type: Array,
    default: [],
  },
  joinedEventsId: {
    type: Array,
    default: [],
  },
  chatsId: {
    type: Array,
    default: []
  },
  premium: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    required: true,
    default: "user",
  },
  promotionEvents: {
    type: Number,
    default: 0,
  },
});

//@ts-ignore
userSchema.pre("save", async function (next: NextFunction) {
  // wykona się przed zapisaniem do bazy danych
  const salt = await bcrypt.genSalt(); // generuje dodatkowe zbędne znaki
  // @ts-ignore
  this.password = await bcrypt.hash(this.password, salt); // hashuje hasło z dodatkowymi znakami
  next();
});

userSchema.statics.login = async function (email: string, password: string) {
  // creating own function to the schema
  const user = await this.findOne({ email });
  if (user) {
    const isAuthenticated = await bcrypt.compare(password, user.password);
    if (isAuthenticated) {
      return user;
    } else {
      throw Error("incorrect password");
    }
  } else {
    throw Error("incorrect email");
  }
};
const User = mongoose.model("user", userSchema);
module.exports = User;
