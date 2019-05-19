const UsuariosController = require("./usuarios");
const PaginasController = require("./paginas");
const PaginasAdminController = require("./paginasAdmin");
const AdministradorController = require("./administrador");
const AuthenticateController = require("./authenticate");
const PropiedadesController = require("./propiedades");
const SubastasController = require("./subasta");

module.exports = {
    UsuariosController,
    PaginasController,
    AdministradorController,
    AuthenticateController,
    PropiedadesController,
    PaginasAdminController,
    SubastasController
}