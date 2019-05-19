const mongoose = require("mongoose");

const Puja = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    monto: { type: String, required: true },
  });
  

const SubastaSchema = new mongoose.Schema({
    propiedad: { type: mongoose.Schema.Types.ObjectId, ref: 'Propiedad', required:true },
    montoMinimo: { type: String, required: true },
    pujas: [Puja],

});

const Subasta = mongoose.model("Subasta", SubastaSchema);

module.exports = Subasta;