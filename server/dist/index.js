"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ----- import packages -----
const express_1 = __importDefault(require("express"));
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
const cityRoutes = require("./routes/cityRoutes");
const { startApolloServer } = require("./apollo/apollo");
// ----- variables -----
const PORT = process.env.PORT || 5001;
const app = (0, express_1.default)();
const corsOptions = {
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
};
// ----- app configuration -----
app.use(cookieParser());
app.use(express_1.default.json());
app.use(express_1.default.text());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express_1.default.static("static"));
app.use(cors(corsOptions));
app.use(fileUpload());
// ----- using routes -----
try {
    app.use(authRoutes);
    app.use(eventRoutes);
    app.use(placeRoutes);
    app.use(userRoutes);
    app.use(cityRoutes);
    console.log("routes successfully imported");
}
catch (err) {
    console.log(`Routes import error : ${err}`);
}
// ----- database connection ------
const mongodbUrl = process.env.MONGODB_URL || "";
mongoose
    .connect(mongodbUrl)
    .then(() => console.log("mongodb successfully connected"))
    .catch((err) => console.log(err));
// ----- start apollo server -----
startApolloServer();
// ----- start socket.io server -----
require("./socketio/main");
// ----- listening -----
app.listen(PORT, () => console.log(`🖥️  Server listening on port ${PORT}`));
// ! TESTS (disable when everything is ok)
// require("./tests/emailTest.js");
// import "./tests/helpersTest";
