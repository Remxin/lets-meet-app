// ----- import packages -----
import express, { Application } from "express";
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("body-parser");
const dotenv = require("dotenv").config();

// ----- files imports -----
const authRoutes = require("./routes/authRoutes");

// ----- variables -----
const PORT = process.env.PORT || 3000;
const app: Application = express();

// ----- app configuration -----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("static"));

// ----- using routes -----
try {
  app.use(authRoutes);
  console.log("routes successfully imported");
} catch (err) {
  console.log(`Routes import error : ${err}`);
}

// ----- database connection ------
const mongodbUrl: string = process.env.MONGODB_URL || "";
mongoose
  .connect(mongodbUrl)
  .then(() => console.log("mongodb successfully connected"))
  .catch((err: any) => console.log(err));

// ----- listening -----
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
