module.exports = (mongoose) => {
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
            usuario: usuario.nombreCompleto,
            types,
            ventas
        });
    }

    async function renderPropertyList(request, response) {
        usuario = await getUsuario(request.session.userId);
        propiedades = await Propiedad.find({})
        response.render("property-list", {
            usuario: usuario.nombreCompleto,
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
            usuario: usuario.nombreCompleto,
        });
    }

    async function renderLogin(request, response) {
        response.render("login", {});
    }


    async function renderSubastaList(request, response) {
        semanasConSubasta = []
        propiedades = await Propiedad.find({})
        propiedadesConSubasta = propiedades.filter((propiedad) => {
            semana = propiedad.semanas.find((semana) => {
                return semana.tipo === "Subasta"
            })
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

    return {
        renderHome,
        renderContact,
        renderLogin,
        renderPropertyList,
        renderSubastaList
    }
}