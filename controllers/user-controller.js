const bcrypt = require('bcryptjs');
const User = require('../models/user');

const userController = {
  registerPage: (req, res) => {
    res.render('register');
  },
  userRegister: (req, res) => {
    return bcrypt.hash(req.body.password, 10).then(hash => {
      User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }).then(() => res.redirect('/users/register'));
    });
  }
};

module.exports = userController;
