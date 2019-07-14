module.exports = (mongoose) => {
    const Administrador = mongoose.model("Administrador");
    const Usuario = mongoose.model("Usuario");
    const reques = require('request');

    async function renderSuperAdminHome(request, response) {
        const administradores = await Administrador.find({});
        response.render("super-admin/super-home", { administradores })
    }

    async function renderAddAdmin(request, response) {
        response.render("super-admin/add-admin");
    }

    async function deleteAdmin(request, response) {
        console.log(request.body)
        reques.delete(`http://localhost:8080/administrador/${request.params.id}`, { body: request.body, json: true }, () => {
            return response.redirect("/admin/super-home");
        });
    }

    async function addNewAdmin(request, response) {
        console.log(request.body)
        reques.post('http://localhost:8080/administrador', { body: request.body, json: true }, () => {
            return response.redirect("/admin/super-home");
        });
    }




    return {
        renderSuperAdminHome,
        renderAddAdmin,
        addNewAdmin,
        deleteAdmin
    }
}