module.exports = (mongoose) => {

    var moment = require('moment');

    const Propiedad = mongoose.model("Propiedad");
    const Usuario = mongoose.model("Usuario");
    const Puja = mongoose.model("Puja");

    function getUsuario(userId) {
        const promise = new Promise((resolve, reject) => {
            console.log(userId)
            const Usuario = mongoose.model("Usuario");
            Usuario.findById(userId).then((usuario) => {
                resolve(usuario)
            })
        })
        return promise
    }
    async function hotsaleReserve(request, response) {
        let propiedad = await Propiedad.findById(request.params.id);
        propiedad.semanas[parseInt(request.params.numeroSemana) - 1].tipo = "Reservada";
        propiedad.semanas[parseInt(request.params.numeroSemana) - 1].usuario = usuario._id;
        propiedad.save();
        usuario.reservas = [...usuario.reservas, { propiedad: propiedad._id, semana: request.params.numeroSemana }]
        usuario.save()
        return response.redirect("/my-properties");
    }



    async function directReserve(request, response) {
        let propiedad = await Propiedad.findById(request.params.id);
        let usuario = await getUsuario(request.session.userId);
        let semana = request.body.semana;
        if (usuario.creditos > 0) {
            propiedad.semanas[parseInt(semana) - 1].tipo = "Reservada";
            propiedad.semanas[parseInt(semana) - 1].usuario = usuario._id;
            propiedad.save();
            usuario.reservas = [...usuario.reservas, { propiedad: propiedad._id, semana }]
            usuario.creditos--;
            usuario.save()
            return response.redirect("/my-properties");
        } else {
            return response.redirect(`/property-detail/${request.params.id}?error=no-credits`);
        }
    }

    function determineSubasta() {
        semanaActual = moment().week();
        semanaSubasta = semanaActual + 24;
        if (semanaSubasta > 50)
            semanaSubasta -= 50;
        return semanaSubasta
    }

    function determineHotsale() {
        semanaActual = moment().week();
        semanaHotsale = semanaActual + 23;
        if (semanaHotsale > 50)
            semanaHotsale -= 50;
        return semanaHotsale
    }

    function determineType(semana) {
        let semanaActual = moment().week();
        let type = "Disponible";
        let semanaSubasta = determineSubasta();
        let semanaHotsale = determineHotsale();
        if (semana.numeroSemana == semanaSubasta) {
            type = 'Subasta'
        }
        if ((semana.numeroSemana >= semanaActual) && (semana.numeroSemana <= semanaHotsale)) {
            type = 'Posible Hotsale'
        }
        if ((semanaHotsale < semanaActual)) {
            if (semana.numeroSemana >= semanaActual || semana.numeroSemana <= semanaHotsale) {
                type = 'Posible Hotsale'
            }
        }
        return type;
    }

    async function cancelReservation(request, response) {
        let usuario = await getUsuario(request.session.userId);
        let propiedad = await Propiedad.findById(request.params.id);
        tipo = determineType(propiedad.semanas[request.params.numeroSemana - 1])
        propiedad.semanas[request.params.numeroSemana - 1].tipo = tipo;
        propiedad.semanas[request.params.numeroSemana - 1].usuario = null;
        if (tipo == "Subasta") {
            propiedad.semanas[request.params.numeroSemana - 1].subasta.habilitada = false;
            propiedad.semanas[request.params.numeroSemana - 1].subasta.montoMinimo = 0;
            propiedad.semanas[request.params.numeroSemana - 1].subasta.pujas = [];
        }
        if (tipo == "Posible Hotsale") {
            propiedad.semanas[request.params.numeroSemana - 1].hotsale.habilitada = false;
            propiedad.semanas[request.params.numeroSemana - 1].hotsale.monto = 0;
        }
        propiedad.save();
        reservaCancelada = usuario.reservas.find((reserva) => {
            return reserva.propiedad == propiedad._id && reserva.semana == request.params.numeroSemana
        })
        console.log(reservaCancelada)
        usuario.reservas.splice(usuario.reservas.indexOf(reservaCancelada), 1);
        usuario.save()
        return response.redirect("/my-properties");
    }


    return {
        directReserve,
        hotsaleReserve,
        cancelReservation,
    }
}