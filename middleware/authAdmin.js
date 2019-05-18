module.exports = (req, res, next) => {
    if (req.session && req.session.adminId) {
        return next();
    } else {
        return res.redirect("/admin/");
    }
}