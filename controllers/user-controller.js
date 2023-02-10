const bcrypt = require('bcryptjs');
const User = require('../models/user');

const userController = {
  getLoginPage: (req, res) => {
    res.render('login');
  },
  userLogin: (req, res) => {
    req.flash('success_message', 'Login successfully !!');
    res.redirect('/records');
  },
  getRegisterPage: (req, res) => {
    res.render('register');
  },
  logout: (req, res, next) => {
    req.logout(err => {
      if (err) {
        return next(err);
      }

      req.flash('success_message', 'Logout successfully !!');
      res.redirect('/users/login');
    });
  },
  userRegister: (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;

    User.findOne({ email })
      .then(user => {
        if (!name || !email || !password || !confirmPassword) {
          req.flash('warning_message', 'All fields are required !!');
          res.redirect('/users/register');
        }

        if (password !== confirmPassword) {
          req.flash('warning_message', "These passwords  don't matched !!");
          res.redirect('/users/register');
        }

        if (user) {
          req.flash('warning_message', 'The email is used already !!');
          res.redirect('/users/register');
        }

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
