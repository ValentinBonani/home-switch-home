const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mustacheExpress = require("mustache-express");
const config = require("./config");
const app = express();
require("./models");

// Keep the config and mongoose inside app so it could be accessed inside it, anywhere
app.engine('mustache', mustacheExpress());
app.set("config", config);
app.set("mongoose", mongoose);
app.set("view engine", "mustache");
// Give our app support to parse JSON data on form POST requests and make it available at req.body
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/resources'));

// Setup mongoose and load models
mongoose.Promise = global.Promise;
mongoose.connect(config.db, {useNewUrlParser: true});
// mongoose.connect(config.db, {useNewUrlParser: true});
const types = [
  { nombre: "Departamento" },
  { nombre: "Cabaña" },
  { nombre: "Casa" },
  { nombre: "Duplex" }
]
const ventas = [
  { nombre: "Directa" },
  { nombre: "Subasta" },
  { nombre: "Hotsales" }
]
// default route handler
app.use("/home",(request, response) => {
  const Usuario = mongoose.model("Usuario");
  response.render("index",{
    types,
    ventas
  });
});
app.use("/contact",(request, response) => {
  response.render("contact",{
    usuario:"Agus"
  });
});

app.use((request, response) => {
  response.status(404).send(request.originalUrl + ' not found');
});



app.listen(8080, () => {
  console.log(`courses-evaluation-api listening on port`);
});

module.exports = app;
