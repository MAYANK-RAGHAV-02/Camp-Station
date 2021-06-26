const express = require('express')
const route = express.Router()
const Station = require('../models/Stations');
const Review = require('../models/Reviews')
const appErr = require('../errorhandler/appErr')
const catchAsync = require('../errorhandler/catchAsync')
const {validReview} = require('../middleware')
const controller = require('../Controller/Review')



route.post('/station/:id/reviews', catchAsync(controller.createReview))

route.delete('/station/:id/reviews/:reviewId',validReview,catchAsync(controller.deleteReview))

module.exports = route;

