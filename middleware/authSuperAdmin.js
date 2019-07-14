module.exports = (req, res, next) => {
    if (req.session && req.session.superAdminId) {
        return next();
    } else {
        return res.redirect("/admin/");
    }
}