const {
    UsuariosController,
    PaginasController,
    AdministradorController,
    AuthenticateController,
    PropiedadesController,
    PaginasAdminController,
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

    const controllers = [
        { basePath: "/usuarios", controller: usuariosController },
        { basePath: "/administrador", controller: administradorController },
        { basePath: "/propiedades", controller: propiedadesController },
    ];

    mapGenericControllerRoutes(controllers, router);

    router.route("/home")
        .get(auth, paginasController.renderHome);
    router.route("/")
        .get(auth, paginasController.renderHome);
    router.route("/contact")
        .get(auth, paginasController.renderContact);
    router.route("/login")
        .get(paginasController.renderLogin);
    router.route("/property-list")
        .get(auth, paginasController.renderSubastaList);
    router.route("/subasta-list")
        .get(auth, paginasController.renderSubastaList);
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
    router.get('/logoutAdmin', authenticateController.logoutAdmin);
    router.get('/admin/property/:id', authAdmin, paginasAdminController.renderPropertyDetails);
    router.get('/delete-property/:id', authAdmin, paginasAdminController.deleteProperty);
    router.get('/admin/subastas-list', authAdmin, paginasAdminController.renderSubastasList);
    router.get('/admin/active-subastas-list', authAdmin, paginasAdminController.renderActiveSubastasList);
    router.get('/admin/subasta/:id', authAdmin, paginasAdminController.renderSubastasDetail);
    router.post('/admin/activate-subasta/:id', authAdmin, paginasAdminController.activateSubasta);

    return router;
};