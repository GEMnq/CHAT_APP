// import thư viện
const express = require("express");
const router = express.Router()

// import files
const accountController = require('../controllers/accountController')
const validator = require('../utils/validator')
const loginValidator = require('../utils/loginValidator')
const auth = require('../middlewares/auth')


// [GET] /register
router.get("/register", accountController.signup);

// [POST] /register
router.post("/register", validator, accountController.register);

// [GET] /login
router.get("/login",  accountController.login);

// [POST] /login
router.post("/login", loginValidator, accountController.loginUser);

// [GET] /logout
router.get("/logout", accountController.logout);

// [GET] /dashboard
router.get("/dashboard", accountController.loadDashboard);

// [GET] /home
router.get("/list", accountController.getListId);

module.exports = router