const UsuariosController = require("./usuarios");
const PaginasController = require("./paginas");
const PaginasAdminController = require("./paginasAdmin");
const AdministradorController = require("./administrador");
const SuperAdminController = require("./super-admin");
const AuthenticateController = require("./authenticate");
const PropiedadesController = require("./propiedades");
const SubastasController = require("./subastas");
const ReservasController = require("./reservas");
const PaginasSuperAdminController = require("./paginasSuperAdmin");

module.exports = {
    UsuariosController,
    PaginasController,
    AdministradorController,
    AuthenticateController,
    PropiedadesController,
    PaginasAdminController,
    SubastasController,
    ReservasController,
    SuperAdminController,
    PaginasSuperAdminController
}