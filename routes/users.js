const express = require('express');
const router = express.Router();
const User = require('../model/user');
const passport = require('passport');
const catchAsync = require('../Utils/catchAsync');
const users = require('../controllers/users');


router.get('/register',users.userRender);

router.post('/register',catchAsync(users.registerUser));

router.get('/login',users.loginForm);
router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),catchAsync(users.Registered));


router.get('/logout',users.logout);

module.exports = router;
