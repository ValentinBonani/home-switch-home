const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;


const AdministradorSchema = new mongoose.Schema({
  nombre: {type: String, required: true},
  email: {type: String, required: true, index: { unique: true }},
  password: { type: String, required: true }
});

AdministradorSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

AdministradorSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

AdministradorSchema.statics.authenticate = function (email, password, callback) {
    Administrador.findOne({ email: email })
      .exec(function (err, admin) {
        if (err) {
          return callback(err)
        } else if (!admin) {
          var err = new Error('admin not found.');
          err.status = 401;
          return callback(err);
        }
        bcrypt.compare(password, admin.password, function (err, result) {
          if (result === true) {
            return callback(null, admin);
          } else {
            return callback();
          }
        })
      });
  }



const Administrador = mongoose.model("Administrador", AdministradorSchema);

module.exports = Administrador;