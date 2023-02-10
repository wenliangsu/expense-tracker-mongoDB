const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

// set up local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    (req, email, password, cb) => {
      User.findOne({ email }).then(user => {
        if (!user) {
          return cb(
            null,
            false,
            req.flash('warning_message', 'This email is nor registered !!')
          );
        }

        bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            return cb(
              null,
              false,
              req.flash('warning_message', 'Email or password is incorrect !!')
            );
          }

          return cb(null, user);
        });
      });
    }
  )
);

// set serialize and deserialize for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .lean()
    .then(user => done(null, user))
    .catch(err => done(err, null));
});

module.exports = passport;
