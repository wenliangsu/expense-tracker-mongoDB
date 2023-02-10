const express = require('express');
const passport = require('passport');
const router = express.Router();

const userController = require('../../controllers/user-controller');

router.get('/login', userController.getLoginPage);
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: true
  }),
  userController.userLogin
);
router.get('/logout', userController.logout);

router.get('/register', userController.getRegisterPage);
router.post('/register', userController.userRegister);

module.exports = router;
