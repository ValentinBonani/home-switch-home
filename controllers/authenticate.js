module.exports = (mongoose) => {

  const Usuario = mongoose.model("Usuario")

function authenticate(req, res, next) {
    if (req.body.email && req.body.password) {
      Usuario.authenticate(req.body.email, req.body.password, function (error, user) {
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

  return {
    authenticate
  }
}