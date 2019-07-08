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

    async function directReserve (request, response){
        let propiedad = await Propiedad.findById( request.params.id); 
        let usuario = await getUsuario(request.session.userId);
        let semana = request.body.semana;
        propiedad.semanas[parseInt(semana) - 1].tipo = "Reservada";
        propiedad.semanas[parseInt(semana) - 1].usuario = usuario._id;
        propiedad.save();
        usuario.reservas = [...usuario.reservas, { propiedad:propiedad._id, semana }]
        usuario.save()
        return  response.redirect("/my-properties");
    }

    return {
        directReserve
    }
}