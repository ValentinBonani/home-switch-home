const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mustacheExpress = require("mustache-express");
const config = require("./config");
const app = express();
const responseHelpers = require("./middleware/responseHelpers")
const routes = require("./routes");
const session =  require('express-session')
require("./models");

// Keep the config and mongoose inside app so it could be accessed inside it, anywhere
app.engine('mustache', mustacheExpress());
app.set("config", config);
app.set("mongoose", mongoose);
app.set("view engine", "mustache");


// Give our app support to parse JSON data on form POST requests and make it available at req.body
app.use(session({secret: 'el dukoh', resave: true, saveUninitialized: false}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/resources'));

// Setup mongoose and load models
mongoose.Promise = global.Promise;
mongoose.connect(config.db, {useNewUrlParser: true});

// Setup middleware
app.use(responseHelpers);

// default route handler
app.use(routes(app, express.Router()));

app.use((request, response) => {
  response.status(404).send('Error 404, la ruta ' + request.originalUrl + ' no existe');
});


app.listen(8080, () => {
  console.log(`courses-evaluation-api listening on port`);
});

module.exports = app;
