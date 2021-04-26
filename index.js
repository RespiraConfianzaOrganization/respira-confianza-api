const express = require("express");
const bodyParser = require("body-parser");
const xmlparser = require('express-xml-bodyparser');
var cors = require('cors')
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
app.use(xmlparser());


app.use(morgan('[:date[iso]] :method :url :status :res[content-length] - :response-time ms'));

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
  methods: "GET, PUT, POST, DELETE"
}
app.use(cors());

// Routes
const routes = require("./src/routes/routes");

app.use("/api", routes);

app.listen(port, () => {
  logger.info(`Server running at ${host}:${port}`);
}
);
