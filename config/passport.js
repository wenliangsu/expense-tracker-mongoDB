const passport = require('passport');
const LocalStrategy = require('passport-local');
const FacebookStrategy = require('passport-facebook');
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

// set passport facebook
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: 'http://localhost:3000/auth/facebook/callback',
      profileFields: ['email', 'displayName']
    },
    function (accessToken, refreshToken, profile, cb) {
      const { name, email } = profile._json;
      User.findOne({ email }).then(user => {
        if (user) return cb(null, user);
        const randomPassword = Math.random().toString(36).slice(-8);
        bcrypt
          .hash(randomPassword, 10)
          .then(hash =>
            User.create({
              name,
              email,
              password: hash
            })
          )
          .then(user => cb(null, user))
          .catch(err => cb(err, false));
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
