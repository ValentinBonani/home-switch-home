module.exports = (mongoose) => {
    const Propiedad = mongoose.model("Propiedad");
    const reques = require('request');


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
        propiedad = await Propiedad.findOne({ _id: request.params.id })
        response.render("admin/property-detail", { propiedad });
    }

    function deleteProperty(request, response) {
        reques.delete('http://localhost:8080/propiedades/' + request.params.id);
        return response.redirect('/admin/home');
    }

    async function renderSubastasList(request, response) {
        semanasConSubasta = []
        propiedades = await Propiedad.find({})
        propiedadesConSubasta = propiedades.filter((propiedad) => {
            semana = propiedad.semanas.find((semana) => {
                return semana.tipo === "Subasta"
            })
            if (semana && !semana.subasta.habilitada) {
                console.log(semana);
                semanasConSubasta.push(semana);
                return semana
            }
            return false
        })
        response.render("admin/subastas-list", {
            propiedadesConSubasta,
            semanasConSubasta,
            title: "Posibles Subastas"

        });
    }

    async function renderActiveSubastasList(request, response) {
        semanasConSubasta = []
        propiedades = await Propiedad.find({})
        propiedadesConSubasta = propiedades.filter((propiedad) => {
            semana = propiedad.semanas.find((semana) => {
                return semana.tipo === "Subasta"
            })
            if (semana && semana.subasta.habilitada) {
                console.log(semana);
                semanasConSubasta.push(semana);
                return semana
            }
            return false
        })
        response.render("admin/subastas-list", {
            propiedadesConSubasta,
            semanasConSubasta,
            title: "Subastas Activas"
        });
    }

    async function renderSubastasDetail(request, response) {
        propiedad = await Propiedad.findOne({ _id: request.params.id })
        subasta = propiedad.semanas.find((semana) => {
            return semana.tipo === "Subasta"
        })
        response.render("admin/subasta-detail", {
            propiedad,
            subasta
        });
    }

    async function activateSubasta(request, response) {
        propiedad = await Propiedad.findOne({ _id: request.params.id })
        semana = propiedad.semanas.find((semana) => {
            return semana.tipo === "Subasta"
        })
        console.log(request.body)
        semana.subasta.montoMinimo = request.body.montoMinimo
        semana.subasta.habilitada = true;
        propiedad.semanas[semana.numeroSemana - 1] = semana;
        propiedad.save();
        return response.redirect("/admin/subastas-list");
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
        renderSubastasDetail,
        renderActiveSubastasList
    }
}