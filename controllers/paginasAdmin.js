module.exports = (mongoose) => {
    const Propiedad = mongoose.model("Propiedad");
    const Subasta = mongoose.model("Subasta");
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
        propiedad = await Propiedad.findOne({ _id: request.params.id }).populate("subastas").exec();
        console.log(propiedad)
        response.render("admin/detail-property", { propiedad: propiedad });
    }

    function deleteProperty(request, response) {
        reques.delete('http://localhost:8080/propiedades/' + request.params.id);
        return response.redirect('/admin/home');
    }

    return {
        renderAdminHome,
        renderLoginAdmin,
        renderAddProperty,
        renderEditProperty,
        renderPropertyDetails,
        deleteProperty
    }
}