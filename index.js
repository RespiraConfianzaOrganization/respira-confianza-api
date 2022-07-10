const http = require('http');
const express = require('express');
const app = express();

const bodyParser = require("body-parser");
const xmlparser = require('express-xml-bodyparser');
const cors = require('cors')
const path = require("path");
const morgan = require('morgan');
const compression = require('compression');

app.use(compression());
app.use(express.static(path.join(__dirname, "build")));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(xmlparser());

app.use(morgan('[:date[iso]] :method :url :status :res[content-length] - :response-time ms'));

/*
var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
  methods: "GET, PUT, POST, DELETE"
}*/
app.use(cors());

// Routes
const routes = require("./src/routes");

app.use("/api", routes);

const httpServer = http.createServer(app);

httpServer.listen(8080, () => {
  console.log("server HTTP starting on port : " + 8080)
});
