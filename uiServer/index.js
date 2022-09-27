const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200,
};
// ----- app configuration -----
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, "../../client/build")));

app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname, "../client/build/index.html"))
);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
