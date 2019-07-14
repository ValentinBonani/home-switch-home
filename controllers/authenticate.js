module.exports = (mongoose) => {

    const Usuario = mongoose.model("Usuario");
    const Admin = mongoose.model("Administrador");
    const SuperAdmin = mongoose.model("SuperAdmin");
    const reques = require('request');


    async function register(req, response, next) {
        let user = await Usuario.findOne({ email: req.body.email });
        console.log(user);
        if (user) {
            response.render("register", { error: 1 });
        }
        reques.post('http://localhost:8080/usuarios/', { body: req.body, json: true }, (err, res, body) => {
            if (res.body && res.body.status) {
                response.render("register", { error: 1 });
            } else {
                Usuario.authenticate(req.body.email, req.body.password, function(error, user) {
                    if (error || !user) {
                        var err = new Error('Email y/o contraseña invalidos');
                        err.status = 401;
                        return next(err);
                    } else {
                        req.session.userId = user._id;
                        return response.redirect('/home');
                    }
                });
            }
        });

    }


    function authenticate(req, res, next) {
        if (req.body.email && req.body.password) {
            Usuario.authenticate(req.body.email, req.body.password, function(error, user) {
                if (error || !user) {
                    var err = new Error('Email y/o contraseña invalidos');
                    err.status = 401;
                    return next(err);
                } else {
                    req.session.userId = user._id;
                    return res.redirect('/home');
                }
            });
        } else {
            var err = new Error('All fields required.');
            err.status = 400;
            return next(err);
        }
    }

    function authenticateAdmin(req, res, next) {
        if (req.body.email && req.body.password) {
            SuperAdmin.authenticate(req.body.email, req.body.password,
                function(error, sAdmin) {
                    if (error || !sAdmin) {
                        Admin.authenticate(req.body.email, req.body.password, function(error, admin) {
                            if (error || !admin) {
                                var err = new Error('Email y/o contraseña invalidos');
                                err.status = 401;
                                return next(err);
                            } else {
                                req.session.adminId = admin._id;
                                return res.redirect('/admin/home');
                            }
                        });
                    } else {
                        req.session.superAdminId = sAdmin._id;
                        return res.redirect('/admin/super-home');
                    }
                }
            )

        } else {
            var err = new Error('All fields required.');
            err.status = 400;
            return next(err);
        }
    }

    function logout(req, res, next) {
        if (req.session) {
            req.session.destroy(function(err) {
                if (err) {
                    return next(err);
                } else {
                    return res.redirect('/login');
                }
            });
        }
    }

    function logoutAdmin(req, res, next) {
        if (req.session) {
            req.session.destroy(function(err) {
                if (err) {
                    return next(err);
                } else {
                    return res.redirect('/admin');
                }
            });
        }
    }

    return {
        authenticate,
        authenticateAdmin,
        logout,
        logoutAdmin,
        register
    }
}