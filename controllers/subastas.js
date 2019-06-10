module.exports = (mongoose) => {

    var moment = require('moment');

    const Propiedad = mongoose.model("Propiedad");
    const Usuario = mongoose.model("Usuario");
    const Puja = mongoose.model("Puja");

    async function descontarYDevolverCredito(subasta, usuario) {
        if(subasta.pujas.length != 0){
            lastUser = await Usuario.findOne({_id: subasta.pujas[0].usuario});
            lastUser.creditos++;
            console.log(lastUser);
            lastUser.save();
        }
        usuario.creditos--;
        usuario.save();
    }


    function validateAmount (amount, subasta) {
        if(subasta.pujas.length === 0){
            return parseInt(amount) > parseInt(subasta.montoMinimo);
        } else {
            return parseInt(amount) > parseInt(subasta.pujas[0].monto);
        }
    }

    function esSubasta(semana) {
        return semana.tipo === "Subasta"
    }

    async function pujarSubasta(request, response) {
        propiedad = await Propiedad.findOne({ _id: request.params.id });
        usuario = await Usuario.findOne({ _id: request.session.userId });
        semana = propiedad.semanas.find(esSubasta);

        montoAPujar = request.body.monto;

        if(validateAmount(montoAPujar, semana.subasta) && usuario.creditos > 0) {
            descontarYDevolverCredito(semana.subasta, usuario)
            newPuja = {
                usuario: request.session.userId,
                monto: montoAPujar,
                fecha: moment().format("YYYY-MM-DD hh:mm:ss")
            }
            propiedad.semanas[semana.numeroSemana - 1].subasta.pujas = [newPuja, ...semana.subasta.pujas];
            propiedad.save();
        } else {
            console.log("Puja menor al actual");
        }
        return response.redirect("/subasta-detail/" + request.params.id);



    }

    return {
        pujarSubasta
    }
}