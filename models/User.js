const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema;



const userShema = new Schema({
    username:{
        type :String,
        required: true
    },
    email :{
        type : String,
        required : true,
        unique: true
    },
    password : {
        type :String,
        required:[true,'must be in String']
    }
})

// userShema.plugin(passportLocalMongoose)

module.exports= new mongoose.model('User',userShema);