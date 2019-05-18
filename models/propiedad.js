const mongoose = require("mongoose");

const PropiedadSchema = new mongoose.Schema({
    pais: { type: String, required: true },
    direccion: { type: String, required: true },
    ciudad: { type: String, required: true },
    descripcion: { type: String, required: true },
    tipo: { type: String, required: true },
    imagen: { type: String, required: true },
    provincia: { type: String, required: true }
});

const Propiedad = mongoose.model("Propiedad", PropiedadSchema);

module.exports = Propiedad;