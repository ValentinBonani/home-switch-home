module.exports = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    } else {
        var err = new Error('Debes iniciar sesion para ver esta pagina.');
        err.status = 401;
        return next(err);
    }
}