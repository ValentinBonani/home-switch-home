module.exports = (mongoose) => {
    const Propiedad = mongoose.model("Propiedad");
    const Usuario = mongoose.model("Usuario");
    const reques = require('request');

    function esSubasta(semana) {
        return semana.tipo === "Subasta"
    }

    function esHotsale(semana) {
        return semana.tipo === "Posible Hotsale"
    }


    function renderLoginAdmin(request, response) {
        response.render("admin/login")
    }

    function renderAdminHome(request, response) {
        Propiedad.find({}).then((propiedades) => {
            response.render("admin/properties", { propiedades })
        })
    }

    function renderAddProperty(request, response) {
        response.render("admin/add-new-property")
    }
    async function renderEditProperty(request, response) {
        propiedad = await Propiedad.find({ _id: request.params.id });
        response.render("admin/edit-property", { propiedad: propiedad[0] });
    }

    async function renderPropertyDetails(request, response) {
        canNotErase = false;
        propiedad = await Propiedad.findOne({ _id: request.params.id });
        reserva = propiedad.semanas.find( semana => semana.tipo === "Reservada");
        if(reserva) {
            canNotErase = true;
        }
        semana = propiedad.semanas.find(esSubasta)
        if (semana && semana.subasta.habilitada) {
            canNotErase = true;
        }
        response.render("admin/property-detail", { 
            propiedad,
            canNotErase
        });
    }

    function deleteProperty(request, response) {
        reques.delete('http://localhost:8080/propiedades/' + request.params.id);
        return response.redirect('/admin/home');
    }

    async function renderSubastasList(request, response) {
        semanasConSubasta = []
        propiedades = await Propiedad.find({})
        propiedadesConSubasta = propiedades.filter((propiedad) => {
            semana = propiedad.semanas.find(esSubasta)
            if (semana && !semana.subasta.habilitada) {
                semanasConSubasta.push(semana);
                return semana
            }
            return false
        })
        response.render("admin/subastas-list", {
            propiedadesConSubasta,
            semanasConSubasta,
            title: "Posibles Subastas",
            goTo: "subasta",

        });
    }

    async function renderHotsaleList(request, response) {
        semanasConHotsale = []
        propiedades = await Propiedad.find({})
        let hotsales = [];
        propiedadesConHotsale = propiedades.filter((propiedad) => {
            hotsalesDePropiedad = propiedad.semanas.filter(esHotsale);
            hotsalesDePropiedad = hotsalesDePropiedad.map((semana) => {
                return {numeroSemana:semana.numeroSemana, direccion: propiedad.direccion, imagen:propiedad.imagen}
            })
            hotsales = [...hotsales, ...hotsalesDePropiedad]
            return hotsalesDePropiedad
        })
        console.log(hotsales);
        response.render("admin/hotsale-list", {
            hotsales,
            title: "Posibles Hotsales",
            goTo: "hotsale",

        });
    }

    async function renderActiveSubastasList(request, response) {
        semanasConSubasta = []
        propiedades = await Propiedad.find({})
        propiedadesConSubasta = propiedades.filter((propiedad) => {
            semana = propiedad.semanas.find(esSubasta)
            if (semana && semana.subasta.habilitada) {
                semanasConSubasta.push(semana);
                return semana
            }
            return false
        })
        response.render("admin/subastas-list", {
            propiedadesConSubasta,
            semanasConSubasta,
            title: "Subastas Activas",
            goTo: "subasta-detail",

        });
    }

    async function renderActiveHotsaleList(request, response) {
        semanasConSubasta = []
        propiedades = await Propiedad.find({})
        propiedadesConSubasta = propiedades.filter((propiedad) => {
            semana = propiedad.semanas.find(esSubasta)
            if (semana && semana.subasta.habilitada) {
                semanasConSubasta.push(semana);
                return semana
            }
            return false
        })
        response.render("admin/subastas-list", {
            propiedadesConSubasta,
            semanasConSubasta,
            title: "Subastas Activas",
            goTo: "subasta-detail",

        });
    }

    async function renderSubastaDetail(request, response) {
        propiedad = await Propiedad.findOne({ _id: request.params.id })
        subasta = propiedad.semanas.find(esSubasta)
        response.render("admin/subasta-detail", {
            propiedad,
            subasta
        });
    }

    async function activateSubasta(request, response) {
        propiedad = await Propiedad.findOne({ _id: request.params.id })
        semana = propiedad.semanas.find(esSubasta)
        semana.subasta.montoMinimo = request.body.montoMinimo
        semana.subasta.habilitada = true;
        propiedad.semanas[semana.numeroSemana - 1] = semana;
        propiedad.save();
        return response.redirect("/admin/subastas-list");
    }

    async function closeSubasta(request, response) {
        propiedad = await Propiedad.findOne({ _id: request.params.id })
        semana = propiedad.semanas.find(esSubasta)
        if(!semana.subasta.pujas || semana.subasta.pujas.length === 0){
            semana.tipo = "Posible Hotsale";
        } else {
            let usuario = await Usuario.findOne({_id: semana.subasta.pujas[0].usuario});
            usuario.reservas = [...usuario.reservas, {propiedad:propiedad._id, semana:semana.numeroSemana} ]
            semana.tipo = "Reservada";
            semana.subasta.habilitada = false;
            semana.usuario = semana.subasta.pujas[0].usuario;
            usuario.save();
        }
        propiedad.semanas[semana.numeroSemana - 1] = semana;
        propiedad.save();
        return response.redirect("/admin/subastas-list");
    }

    async function renderSubastaActivaDetail (request, response) {
        propiedad = await Propiedad.findOne({ _id: request.params.id })
        semana = propiedad.semanas.find(esSubasta);
        pujas = semana.subasta.pujas;
        response.render("admin/subasta-activa-detail", {
            propiedad,
            semana,
            pujas
        });
    }

    filterUsers = (text, render) => {
        return render(text);
    }

    async function renderUserList (request, response) {
        usuarios = await Usuario.find({});

        response.render("admin/user-list", {
            usuarios,
            filterUsers
        });
    }

    async function renderUserDetails (request, response) {
        usuario = await Usuario.findOne({_id: request.params.id});
        response.render("admin/user-detail", {
            usuario
        });
    }

    async function changeUserState (request, response) {
        usuario = await Usuario.findOne({_id: request.params.id});
        if (usuario.pedido) {
            usuario.pedido = false;
            if (usuario.tipo === 0) usuario.tipo = 1;
            else usuario.tipo = 0;
            usuario.save();
        }
        return response.redirect("/admin/user-list");
    }


    return {
        renderAdminHome,
        renderLoginAdmin,
        renderAddProperty,
        renderEditProperty,
        renderPropertyDetails,
        deleteProperty,
        renderSubastasList,
        activateSubasta,
        renderSubastaDetail,
        renderSubastaActivaDetail,
        renderActiveSubastasList,
        closeSubasta,
        renderUserList,
        renderUserDetails,
        renderHotsaleList,
        renderActiveHotsaleList,
        changeUserState
    }
}