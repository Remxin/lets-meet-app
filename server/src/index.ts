// ----- import packages -----
import express, { Application } from "express";
import path from "path"
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();
const cors = require("cors");
const fileUpload = require("express-fileupload");


// ----- files imports -----
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const placeRoutes = require("./routes/placeRoutes");
const userRoutes = require("./routes/userRoutes");
const cityRoutes = require("./routes/cityRoutes")

const { startApolloServer } = require("./apollo/apollo");

// ----- variables -----
const PORT = process.env.PORT || 5001;
const app: Application = express();
const corsOptions: any = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200,
  secure: false
};

// ----- app configuration -----
app.use(cookieParser());
app.use(express.json());
app.use(express.text())
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("static"));
app.use(cors(corsOptions));
app.use(fileUpload());
app.use(function(req, res, next) {  
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
}); 

// ----- using routes -----
try {
  app.use(authRoutes);
  app.use(eventRoutes);
  app.use(placeRoutes);
  app.use(userRoutes);
  app.use(cityRoutes)
  app.use(express.static(path.join(__dirname, "../../client/build")))

  app.get("/*", (req, res) => res.sendFile(path.resolve(__dirname, "../../client/build/index.html")))
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

// ----- start apollo server -----
startApolloServer();

// ----- start socket.io server -----
require("./socketio/main")

// ----- listening -----
app.listen(PORT, () => console.log(`🖥️  Server listening on port ${PORT}`));

// ! TESTS (disable when everything is ok)
// import "./tests/emailTest.js";
// import "./tests/helpersTest";
