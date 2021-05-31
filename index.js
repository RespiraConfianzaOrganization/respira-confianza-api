var fs = require('fs');
var http = require('http');
var https = require('https');
var certificate = fs.readFileSync('config/certs/selfsigned.crt', 'utf8');
var privateKey = fs.readFileSync('config/certs/selfsigned.key', 'utf8');
var ca = fs.readFileSync('config/certs/selfsigned.ca-bundle', 'utf8');

var credentials = { key: privateKey, cert: certificate, ca: ca, };
var express = require('express');
var app = express();

const bodyParser = require("body-parser");
const xmlparser = require('express-xml-bodyparser');
var cors = require('cors')
const path = require("path");
const morgan = require('morgan');

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
const routes = require("./src/routes");

app.use("/api", routes);

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080, () => {
  console.log("server HTTP starting on port : " + 8080)
});

httpsServer.listen(8082, () => {
  console.log("server HTTPS starting on port : " + 8082)
});
