const express = require('express')
const route = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')
const catchasync = require('../errorhandler/catchAsync')
const controller = require('../Controller/User')




route.get('/register',controller.registerForm)


route.post('/register',catchasync(controller.register))

route.get('/login',controller.loginForm)



route.post('/login',catchasync( controller.login))


route.get('/logout' ,controller.logout)


module.exports = route