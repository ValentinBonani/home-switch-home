const {
    UsuariosController,
    PaginasController,
    AdministradorController,
    AuthenticateController,
    PropiedadesController,
    PaginasAdminController,
    SubastasController
} = require("./controllers");

const auth = require("./middleware/auth");
const authAdmin = require("./middleware/authAdmin");

function mapGenericControllerRoutes(controllers, router) {
    controllers.forEach(({ basePath, controller }) => {
        router.route(basePath)
            .get(controller.list)
            .post(controller.create);

        router.route(`${basePath}/:id`)
            .get(controller.read)
            .post(controller.update)
            .delete(controller.remove);
    });
}

module.exports = (app, router) => {
    const mongoose = app.get("mongoose");
    const usuariosController = UsuariosController(mongoose);
    const paginasController = PaginasController(mongoose);
    const administradorController = AdministradorController(mongoose);
    const authenticateController = AuthenticateController(mongoose);
    const propiedadesController = PropiedadesController(mongoose);
    const paginasAdminController = PaginasAdminController(mongoose);
    const subastasController = SubastasController(mongoose);

    const controllers = [
        { basePath: "/usuarios", controller: usuariosController },
        { basePath: "/administrador", controller: administradorController },
        { basePath: "/propiedades", controller: propiedadesController },
        { basePath: "/subastas", controller: subastasController },
    ];

    mapGenericControllerRoutes(controllers, router);

    router.route("/home")
        .get(auth, paginasController.renderHome);
    router.route("/")
        .get(auth, paginasController.renderHome);
    router.route("/contact")
        .get(paginasController.renderContact);

    router.route("/login")
        .get(paginasController.renderLogin);

    router.route("/authenticate")
        .post(authenticateController.authenticate);

    router.route("/admin")
        .get(paginasAdminController.renderLoginAdmin);

    router.route("/admin/home")
        .get(authAdmin, paginasAdminController.renderAdminHome);

    router.route("/admin/authenticate")
        .post(authenticateController.authenticateAdmin);

    router.route("/admin/add-property")
        .get(authAdmin, paginasAdminController.renderAddProperty);

    router.route("/admin/edit-property/:id")
        .get(paginasAdminController.renderEditProperty);

    router.get('/logout', authenticateController.logout);

    router.get('/admin/property/:id', paginasAdminController.renderPropertyDetails);
    router.get('/delete-property/:id', paginasAdminController.deleteProperty);
    return router;
};