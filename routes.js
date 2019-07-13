const {
    UsuariosController,
    PaginasController,
    AdministradorController,
    AuthenticateController,
    PropiedadesController,
    PaginasAdminController,
    SubastasController,
    ReservasController
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
    const reservasController = ReservasController(mongoose);

    const controllers = [
        { basePath: "/usuarios", controller: usuariosController },
        { basePath: "/administrador", controller: administradorController },
        { basePath: "/propiedades", controller: propiedadesController },
    ];

    mapGenericControllerRoutes(controllers, router);

    router.route("/home")
        .get(paginasController.renderHome);
    router.route("/")
        .get(paginasController.renderHome);
    router.route("/contact")
        .get(auth, paginasController.renderContact);
    router.route("/login")
        .get(paginasController.renderLogin);
    router.route("/property-list")
        .get(auth, paginasController.renderPropertyList);
    router.route("/property-filter")
        .post(auth, paginasController.renderPropertyFilter);
    router.route("/property-detail/:id")
        .get(auth, paginasController.renderPropertyDetail);
    router.route("/subasta-list")
        .get(auth, paginasController.renderSubastaList);
    router.route("/authenticate")
        .post(authenticateController.authenticate);
    router.route("/register")
        .get(paginasController.renderRegister);
    router.route("/register")
        .post(authenticateController.register);
    router.route("/subasta-detail/:id")
        .get(auth, paginasController.renderSubastaDetail);
    router.route("/pujar/:id")
        .post(auth, subastasController.pujarSubasta);
    router.route("/profile")
        .get(auth, paginasController.renderProfile);
    router.route("/my-properties")
        .get(auth, paginasController.renderMyProperties);
    router.route("/edit-profile")
        .get(auth, paginasController.renderEditProfile);
    router.route("/edit-profile/:id")
        .post(auth, paginasController.editProfile);
    router.route("/change-state/:id")
        .get(auth, paginasController.changeState);
    router.route("/reserve-property/:id")
        .post(auth, reservasController.directReserve);



    router.route("/admin")
        .get(paginasAdminController.renderLoginAdmin);
    router.route("/admin/home")
        .get(authAdmin, paginasAdminController.renderAdminHome);
    router.route("/admin/user-list")
        .get(authAdmin, paginasAdminController.renderUserList);
    router.route("/admin/authenticate")
        .post(authenticateController.authenticateAdmin);
    router.route("/admin/add-property")
        .get(authAdmin, paginasAdminController.renderAddProperty);
    router.route("/admin/edit-property/:id")
        .get(paginasAdminController.renderEditProperty);
    router.route("/admin/user-details/:id")
        .get(paginasAdminController.renderUserDetails);
    router.route("/admin/accept-petition/:id")
        .get(paginasAdminController.changeUserState);

    router.get('/logout', authenticateController.logout);
    router.get('/logoutAdmin', authenticateController.logoutAdmin);
    router.get('/admin/property/:id', authAdmin, paginasAdminController.renderPropertyDetails);
    router.get('/delete-property/:id', authAdmin, paginasAdminController.deleteProperty);
    router.get('/admin/subastas-list', authAdmin, paginasAdminController.renderSubastasList);
    router.get('/admin/active-subastas-list', authAdmin, paginasAdminController.renderActiveSubastasList);
    router.get('/admin/hotsale-list', authAdmin, paginasAdminController.renderHotsaleList);
    router.get('/admin/active-hotsale-list', authAdmin, paginasAdminController.renderActiveHotsaleList);
    router.get('/admin/subasta/:id', authAdmin, paginasAdminController.renderSubastaDetail);
    router.get('/admin/subasta-detail/:id', authAdmin, paginasAdminController.renderSubastaActivaDetail);
    router.post('/admin/activate-subasta/:id', authAdmin, paginasAdminController.activateSubasta);
    router.post('/admin/close-subasta/:id', authAdmin, paginasAdminController.closeSubasta);

    return router;
};