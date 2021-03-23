const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const morgan = require('morgan');
const logger = require('./logger')

// dotenv
require("dotenv").config();
const port = process.env.PORT;
const host = process.env.HOST;

const app = express();

app.use(express.static(path.join(__dirname, "build")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(morgan('[:date[iso]] :method :url :status :res[content-length] - :response-time ms'));

// Routes
const routes = require("./src/routes/routes");

app.use("/api", routes);

app.listen(port, () => {
  logger.info(`Server running at ${host}:${port}`);
  //logger.warn('And fits on your back?');
  //logger.error('Its log, log, log');
}
);
