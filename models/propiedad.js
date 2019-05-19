const mongoose = require("mongoose");

const SemanaSchema = new mongoose.Schema({

    numeroSemana: { type: String, required: true },
    tipo: {type:String, required: true},
    subasta: {type:mongoose.Schema.Types.ObjectId, ref:"Subasta"},
    propiedad: {type:mongoose.Schema.Types.ObjectId, ref:"Propiedad", required:true}
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

Semanas = Array(50).fill({numeroSemana:1,tipo:"Disponible",propiedad:""})
PropiedadSchema.post('save',  (next) => {
    const propiedad = this;
    console.log(propiedad)
    Semanas.map( (semana,index) => {
        semana.numeroSemana = index + 1;
        semana.propiedad = propiedad._id;
    })
    const Semana = mongoose.model("Semana")
    Semana.create(Semanas).then(() => {
        next();
    })
})




const Propiedad = mongoose.model("Propiedad", PropiedadSchema);
const Semana = mongoose.model("Semana", SemanaSchema);

module.exports = {
    Propiedad,
    Semana
}