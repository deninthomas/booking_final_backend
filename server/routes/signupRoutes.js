const express = require("express");
const signupRoute = express.Router();
const signUpController = require("../controller/signUpController");

// Common endpoint for signup and login
signupRoute.post("/signup", signUpController.signup);
signupRoute.post("/login", signUpController.login)

module.exports = signupRoute;
