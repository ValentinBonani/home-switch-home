const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  dni:{type: String, required: true},
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);

module.exports = Usuario;