const stringifyBoolean = require('@mapbox/mapbox-sdk/services/service-helpers/stringify-booleans');
const mongoose = require('mongoose');
const Reviews = require('./Reviews');
const Schema = mongoose.Schema;
const User = require('./User')

const opts = { toJSON : { virtuals: true}};

const ImageSchema = new Schema({
    url:String,
    filename:String
    });

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_175')
})

const stationSchema = new Schema({
    title: String,
    Images:[ImageSchema],
    geometry: {
        type:{
            type:String,
            enum:['Point'],
            required: true
        },
        coordinates:{
            type:[Number],
            required: true
        }

    },
    price: Number,
    location: String,
    description: String,
    author : {
        type : Schema.Types.ObjectId,
        ref :'User'
    },
    reviews:[{
        type: Schema.Types.ObjectId,
        ref:'Review'
    }]
}, opts);

stationSchema.virtual('properties.popUpMarker').get(function (){
    return `<strong> <a href ="/station/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,20)}...</p>`
})



stationSchema.post('findOneAndDelete', async function (doc){
 if(doc) {
     await Reviews.deleteMany({
         _id:{
             $in : doc.reviews
         }
     })
 }
})


const Station = new mongoose.model('Station',stationSchema);

module.exports = Station;