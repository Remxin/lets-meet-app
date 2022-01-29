// ----- import packages -----
import express, { Application } from "express";
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();
const cors = require("cors");

// ----- files imports -----
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const placeRoutes = require("./routes/placeRoutes");

// ----- variables -----
const PORT = process.env.PORT || 5001;
const app: Application = express();
const corsOptions: any = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200,
};

// ----- app configuration -----
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("static"));
app.use(cors(corsOptions));

// ----- using routes -----
try {
  app.use(authRoutes);
  app.use(eventRoutes);
  app.use(placeRoutes);
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
