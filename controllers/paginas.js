module.exports = (mongoose) => {

    const reques = require('request');

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
    const Propiedad = mongoose.model("Propiedad");

    function determinePrice(subasta){
        console.log(subasta)
        if(subasta.pujas.length === 0){
            return subasta.montoMinimo
        }
        else{
            return subasta.pujas[0].monto;
        }
    }

    function esSubasta(semana) {
        return semana.tipo === "Subasta"
    }

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

    async function renderHome(request, response) {
        var usuario;
        try {
            usuario = await getUsuario(request.session.userId);
        } catch (err) {
            response.send("error");
        }
        response.render("index", {
            usuario,
            types,
            ventas
        });
    }

    async function renderPropertyList(request, response) {
        usuario = await getUsuario(request.session.userId);
        propiedades = await Propiedad.find({})
        response.render("property-list", {
            usuario,
            types,
            ventas,
            propiedades
        });
    }

    async function renderContact(request, response) {
        try {
            usuario = await getUsuario(request.session.userId);
        } catch (err) {
            response.send("error");
        }
        response.render("contact", {
            usuario,
        });
    }

    async function renderProfile(request, response) {
        try {
            usuario = await getUsuario(request.session.userId);
        } catch (err) {
            response.send("error");
        }
        response.render("profile", {usuario});
    }

    async function renderEditProfile(request, response) {
        try {
            usuario = await getUsuario(request.session.userId);
        } catch (err) {
            response.send("error");
        }
        response.render("edit-profile", {usuario});
    }

    async function editProfile(request, response) {
        console.log(request.body)
        reques.post('http://localhost:8080/usuarios/' + request.params.id, {body:request.body, json:true});
        return response.redirect("/profile");
    }


    async function renderLogin(request, response) {
        response.render("login", {});
    }


    async function renderSubastaList(request, response) {
        semanasConSubasta = []
        propiedades = await Propiedad.find({})
        propiedadesConSubasta = propiedades.filter((propiedad) => {
            semana = propiedad.semanas.find((esSubasta))
            if (semana && semana.subasta.habilitada) {
                semanasConSubasta.push(semana);
                return semana
            }
            return false
        })
        response.render("subasta-list", {
            propiedadesConSubasta,
            semanasConSubasta,
            title: "Subastas Activas"
        });
    }

    async function renderSubastaDetail(request, response) {
        propiedad = await Propiedad.findOne({ _id: request.params.id });
        semana = propiedad.semanas.find(esSubasta);
        montoActual = determinePrice(semana.subasta);
        response.render("subasta-detail", {
            propiedad,
            semana,
            montoActual
        });
    }

    return {
        renderHome,
        renderContact,
        renderLogin,
        renderPropertyList,
        renderSubastaList,
        renderSubastaDetail,
        renderProfile,
        renderEditProfile,
        editProfile
    }
}