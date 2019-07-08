var moment = require('moment');
const mongoose = require("mongoose");


const PujaSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    monto: { type: String, required: true },
    fecha: { type: String, required: true }
});

const SubastaSchema = new mongoose.Schema({
    montoMinimo: { type: String, required: true },
    habilitada: { type: Boolean, default: false },
    pujas: [PujaSchema],
});

const SemanaSchema = new mongoose.Schema({
    numeroSemana: { type: String, required: true },
    tipo: { type: String, required: true },
    subasta: SubastaSchema,
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
});

const PropiedadSchema = new mongoose.Schema({
    pais: { type: String, required: true },
    direccion: { type: String, required: true },
    ciudad: { type: String, required: true },
    descripcion: { type: String, required: true },
    tipo: { type: String, required: true },
    imagen: { type: String, required: true },
    provincia: { type: String, required: true },
    semanas: [SemanaSchema]
});

PropiedadSchema.post('save', (propiedad, next) => {
    if (propiedad.semanas.length === 0) {
        propiedad.semanas = Array(50).fill({}).map(mapSemanas)
        propiedad.save();
    }
    next();
})

function mapSemanas(propiedad, index, arr) {

    semanaSubasta = determineSubasta();

    let newSemana = {
        numeroSemana: index + 1,
        tipo: 'Disponible'
    }

    if (newSemana.numeroSemana === semanaSubasta) {
        newSemana.tipo = 'Subasta'
        newSemana.subasta = {
            montoMinimo: 0,
            pujas: []
        }
    }

    semanaActual = moment().week();
    console.log(semanaActual)

    semanaHotsale = determineHotsale();

    if (((newSemana.numeroSemana >= semanaActual) && (newSemana.numeroSemana <= semanaHotsale)))
        newSemana.tipo = 'Hotsale'
    if ((semanaHotsale < semanaActual)) {
        if (newSemana.numeroSemana >= semanaActual || newSemana.numeroSemana <= semanaHotsale) {
            newSemana.tipo = 'Hotsale'
        }
    }
    return newSemana;
}

function determineHotsale() {
    semanaActual = moment().week();
    semanaHotsale = semanaActual + 23;
    if (semanaHotsale > 50)
        semanaHotsale -= 50;
    return semanaHotsale
}

function determineSubasta() {
    semanaActual = moment().week();
    semanaSubasta = semanaActual + 24;
    if (semanaSubasta > 50)
        semanaSubasta -= 50;
    return semanaSubasta
}

const Propiedad = mongoose.model("Propiedad", PropiedadSchema);
const Semana = mongoose.model("Semana", SemanaSchema);
const Subasta = mongoose.model("Subasta", SubastaSchema);
const Puja = mongoose.model("Puja", PujaSchema);

module.exports = {
    Propiedad,
    Semana
}