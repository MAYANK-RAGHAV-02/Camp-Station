const express = require('express')
const route = express.Router()
const Station = require('../models/Stations');
const appErr = require('../errorhandler/appErr')
const catchAsync = require('../errorhandler/catchAsync');
const { SchemaTypeOptions } = require('mongoose');
const {valid, loginStrict} = require('../middleware')
const controller = require('../Controller/station') 

const {storage} =require('../cloudinary')
const multer  = require('multer')
const upload = multer({storage})



route.get('/station',loginStrict, catchAsync(controller.index))


route.get('/station/new',loginStrict,controller.renderNew)


route.post('/station',loginStrict,upload.array('image'), catchAsync(controller.create))

    
route.get('/station/:id',loginStrict, catchAsync(controller.detail))



route.get('/station/:id/edit',loginStrict, valid,catchAsync(controller.editForm))



route.put('/station/:id',loginStrict,upload.array('image'),valid, catchAsync( controller.edit))

// 
route.delete('/station/:id',loginStrict, catchAsync(controller.delete))


module.exports = route;