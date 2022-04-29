const AuthRoute = require('express').Router();
const user = require('../Models/User');
const {registerUser,userLogin} = require('../Controllers/MainController');

AuthRoute.post("/register",registerUser);
AuthRoute.post("/login",userLogin);

module.exports = AuthRoute;