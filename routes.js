const {
    UsuariosController,
    PaginasController,
    AdministradorController,
    AuthenticateController,
    PropiedadesController,
    PaginasAdminController
} = require("./controllers");

<<<<<<< HEAD
  const auth = require("./middleware/auth");
  const authAdmin = require("./middleware/authAdmin");
  
  function mapGenericControllerRoutes(controllers, router) {
    controllers.forEach(({basePath, controller}) => {
      router.route(basePath)
        .get(controller.list)
        .post(controller.create);
  
      router.route(`${basePath}/:id`)
        .get(controller.read)
        .put(controller.update)
        .delete(controller.remove);
=======
const auth = require("./middleware/auth")

function mapGenericControllerRoutes(controllers, router) {
    controllers.forEach(({ basePath, controller }) => {
        router.route(basePath)
            .get(controller.list)
            .post(controller.create);

        router.route(`${basePath}/:id`)
            .get(controller.read)
            .post(controller.update)
            .delete(controller.remove);
>>>>>>> 562d89e20e4cfff231cc84a6e75f8e34f21542f4
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
        .get(paginasController.renderContact);

    router.route("/login")
        .get(paginasController.renderLogin);

    router.route("/authenticate")
        .post(authenticateController.authenticate);

    router.route("/admin")
<<<<<<< HEAD
      .get(paginasAdminController.renderLoginAdmin);
    
      router.route("/admin/home")
      .get(authAdmin, paginasAdminController.renderAdminHome);
=======
        .get(paginasAdminController.renderLoginAdmin);

    router.route("/admin/home")
        .get(paginasAdminController.renderAdminHome);
>>>>>>> 562d89e20e4cfff231cc84a6e75f8e34f21542f4

    router.route("/admin/authenticate")
        .post(authenticateController.authenticateAdmin);

    router.route("/admin/add-property")
<<<<<<< HEAD
      .get(authAdmin, paginasAdminController.renderAddProperty);

=======
        .get(paginasAdminController.renderAddProperty);
    router.route("/admin/edit-property/:id")
        .get(paginasAdminController.renderEditProperty);
>>>>>>> 562d89e20e4cfff231cc84a6e75f8e34f21542f4
    router.get('/logout', authenticateController.logout);
    return router;
};