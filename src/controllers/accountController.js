const User = require('../models/userModel')
const { validationResult } = require('express-validator');
require('dotenv').config()
const { MgMultiToObject } = require('../utils/mongoose')

const home = (req, res) => {
    res.render('box/404', {showHeader: false});
}

const signup = (req, res, next) => {
    let err = req.flash('err')
    let flash = req.flash('flash')
    let message = req.flash('message')
    res.render('user/signUp', { err, flash, message, showHeader: false})
}

const register = async (req, res, next) => {
    try {
        // validate information register
        const result = validationResult(req)
        if (result.errors.length > 0) {
            console.log(result.errors)
            req.flash('err', result.errors[0].msg)
            return res.redirect('/api/auth/register')
        }
        
        let imgName = "image" + (Math.floor(Math.random() * 6) + 1) + ".png";

        const { fullName, email, password } = req.body
        const findUser = await User.findOne({ email })
        if (!findUser) {
            const newUser = await User.create({
                fullName,
                email,
                password,
                image: imgName,
            })
            await newUser.save()  
            // send flash message
            req.flash('flash', 'success')
            req.flash('message', 'New account created successfully. Please check your mail')
            return res.redirect('/api/auth/login')
        } else {
            req.flash('err', "Account already exists")
            return res.redirect('/api/auth/register')
        }
    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    let err = req.flash('err')
    res.render('user/logIn', { err, showHeader: false })
}

const loginUser = async (req, res, next) => {
    try {
        // validate 
        const result = validationResult(req)
        if (result.errors.length > 0) {
            req.flash('err', result.errors[0].msg)
            return res.redirect('/api/auth/login')
        }
        
        const { email , password } = req.body
        const findUser = await User.findOne({ email })
        if (!findUser) {
            req.flash('err', 'Account does not exist. Please register for an account already exists')
            return res.redirect('/api/auth/login')
        }
        // check password
        const comparePassword = await findUser?.comparePassword(password)
        if (!comparePassword) {
            req.flash('err', 'Invalid password')            
            return res.redirect('/api/auth/login')
        }
        if (findUser && comparePassword) {
            // session
            req.session.user = findUser; 
            return res.redirect('/api/auth/dashboard')
        }
    } catch (error) {
        next(error)
    }
}

const logout = async (req, res, next) => {
    req.session.destroy();
    
    return res.redirect('/api/auth/login')
}

const loadDashboard = async (req, res, next) => {
    const { fullName } = req.session.user;
    var data = await User.find({_id: { $nin: [req.session.user._id] } })
    res.render('dashboard/dashboard', { user: req.session.user, data: MgMultiToObject(data), fullName, showHeader: true })
}

module.exports = {
    home,
    signup,
    register,    
    login,
    loginUser,  
    logout,
    loadDashboard,  
}