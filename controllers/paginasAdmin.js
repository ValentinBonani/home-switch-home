module.exports = (mongoose) => {

    function renderLoginAdmin (request, response) {
        response.render("admin/login")
    }

    function renderAdminHome(request, response) {
        const Propiedad = mongoose.model("Propiedad");
        Propiedad.find({}).then((propiedades) => {
            console.log(propiedades)
            response.render("admin/properties", {propiedades})
        })
    }
    function renderAddProperty(request, response) {
        response.render("admin/add-new-property")
    }
    return {
        renderAdminHome,
        renderLoginAdmin,
        renderAddProperty
    }
}