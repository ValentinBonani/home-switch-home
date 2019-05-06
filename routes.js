const {
    UsuariosController,
    PaginasController,
    AdministradorController,
    AuthenticateController
  } = require("./controllers");

  const auth = require("./middleware/auth")
  
  function mapGenericControllerRoutes(controllers, router) {
    controllers.forEach(({basePath, controller}) => {
      router.route(basePath)
        .get(controller.list)
        .post(controller.create);
  
      router.route(`${basePath}/:id`)
        .get(controller.read)
        .put(controller.update)
        .delete(controller.remove);
    });
  }
  
  module.exports = (app, router) => {
    const mongoose = app.get("mongoose");
    const usuariosController = UsuariosController(mongoose);
    const paginasController = PaginasController(mongoose);
    const administradorController = AdministradorController(mongoose);
    const authenticateController = AuthenticateController(mongoose);
  
    const controllers = [
      {basePath: "/usuarios", controller: usuariosController},
      {basePath: "/administrador", controller: administradorController},
    ];
  
    mapGenericControllerRoutes(controllers, router);
  
    router.route("/home")
      .get( auth, paginasController.renderHome);
    router.route("/")
      .get(auth, paginasController.renderHome);
    router.route("/contact")
      .get(paginasController.renderContact);

    router.route("/login")
      .get(paginasController.renderLogin);

    router.route("/authenticate")
      .post(authenticateController.authenticate);

    router.get('/logout', function(req, res, next) {
        if (req.session) {
          req.session.destroy(function(err) {
            if(err) {
              return next(err);
            } else {
              return res.redirect('/home');
            }
          });
        }
      });
    return router;
  };
  