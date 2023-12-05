// import thư viện
const express = require("express");
const handlebars = require("express-handlebars");
const path = require("path");
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require("cookie-parser");
const flash = require('connect-flash')
const cors = require('cors')
require('dotenv').config()


const configServer = (app, pathDirname) => {
    // Config cho file env
    require('dotenv').config()

    // middleware body-parser
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // config view engine
    app.engine(".hbs", handlebars({
        extname: ".hbs",
        defaultLayout: "main",
        helpers: {
            index: (index, count) => index + count,
            equals: function(op, options) {
                if (op > 0) return options.fn(this)
                return options.inverse(this)
            },
            isOnline: function(op, options) {
            if (op === "1") return options.fn(this)
            return options.inverse(this)
            }
        },
    }));

    // set view engine & path views
    app.set("view engine", ".hbs");
    app.set("views", path.join(pathDirname, "/views"));

    // config public files
    app.use(express.static(path.join(pathDirname, 'public')))

    // config cookie
    app.use(cookieParser("secret_password_here"));
    // config session
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    }))

    // set flash message
    app.use(flash());

    // config cors
    app.use(cors());
}

module.exports = configServer 