const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const port = process.env.PORT;
const host = process.env.HOST;
// dotenv

const app = express();

app.use(express.static(path.join(__dirname, "build")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const routes = require("./src/routes/routes");

app.use("/api", routes);

app.listen(port, () =>
  console.log(`Respira Confianza api listening at ${host}:${port}`)
);
