const fs = require('fs');
const http = require('http');
const https = require('https');
const certificate = fs.readFileSync('config/certs/selfsigned.crt', 'utf8');
const privateKey = fs.readFileSync('config/certs/selfsigned.key', 'utf8');
const ca = fs.readFileSync('config/certs/selfsigned.ca-bundle', 'utf8');

const credentials = { key: privateKey, cert: certificate, ca: ca, };
const express = require('express');
const app = express();

const bodyParser = require("body-parser");
const xmlparser = require('express-xml-bodyparser');
const cors = require('cors')
const path = require("path");
const morgan = require('morgan');

app.use(express.static(path.join(__dirname, "build")));
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
// const httpsServer = https.createServer(credentials, app);

const port = process.env.PORT || 8000

httpServer.listen(port, () => {
  console.log("server HTTP starting on port : " + port)
});

// httpsServer.listen(8082, () => {
//   console.log("server HTTPS starting on port : " + 8082)
// });
