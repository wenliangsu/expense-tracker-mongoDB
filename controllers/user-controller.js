const bcrypt = require('bcryptjs');
const User = require('../models/user');

const userController = {
  registerPage: (req, res) => {
    res.render('register');
  },
  userRegister: (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;

    User.findOne({ email })
      .then(user => {
        if (!name || !email || !password || !confirmPassword) {
          throw new Error('All fields are required !!');
        }

        if (password !== confirmPassword) {
          throw new Error("These passwords  don't matched !!");
        }

        if (user) throw new Error('The email is used already !!');

        return bcrypt.hash(req.body.password, 10);
      })
      .then(hash => {
        User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash
        }).then(() => {
          req.flash('success_message', 'Account is created successfully !!');
          res.redirect('/users/register');
        });
      })
      .catch(err => next(err));
  }
};

module.exports = userController;
