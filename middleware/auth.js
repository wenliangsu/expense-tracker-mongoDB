// Thinking 為了程式的擴充性，故拆解成如此（可以看auth-helpers的理由）
const helper = require('../helpers/auth-helpers');

const authenticated = (req, res, next) => {
  if (helper.ensureAuthenticated(req)) {
    return next();
  }

  res.redirect('/users/login');
};

module.exports = { authenticated };
