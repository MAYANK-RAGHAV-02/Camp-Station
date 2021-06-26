const Station = require('../models/Stations')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxtoken = process.env.MAPBOX_TOKEN;   
const geocoder = mbxGeocoding( {accessToken: mapBoxtoken})
const cloudinary = require('cloudinary')

module.exports.index = async (req,res)=>{
    const showAll = await Station.find({})
    
    res.render('Station/show',{showAll})
}



module.exports.renderNew = (req,res)=>{
    res.render('Station/create')
}


module.exports.create = async (req,res ,next)=>{
   
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()
    const newLocation =  new Station(req.body)
    newLocation.geometry=geoData.body.features[0].geometry;
    newLocation.Images = req.files.map(f =>({ url: f.path , filename: f.filename}))
    newLocation.author = req.session.user_id
    await  newLocation.save()
    req.flash('success','Successfully created a New Station')
    res.redirect(`/station/${newLocation._id}`)
}



module.exports.detail = async (req,res)=>{
    try{
    const user = req.session.user_id
    const detail =  await Station.findById(req.params.id).populate({
        path :'reviews',
        populate:{
            path:'author'
        }
    }).populate('author')
    res.render('Station/detail' ,{detail ,user})
}catch(e){
    req.flash('error','Page Not found')
    res.redirect('/station')
}
}


module.exports.editForm = async (req,res)=>{
    const {id} = req.params;
    const oldStat = await Station. findById(id)
    
    res.render('Station/edit',{oldStat})
}


module.exports.edit =async (req,res)=>{
    const {id} = req.params;
    console.log("deleteimage",req.body.deleteImages)
    const newStat = await Station.findByIdAndUpdate(id,req.body ,{ runValidators:true, new:true})
    const img = req.files.map(f =>({ url: f.path , filename: f.filename}))
    newStat.Images.push(...img);
    await newStat.save();
    req.flash('success','successfully edit the Station')
  
    if(req.body.deleteImages){

     
        for(let filename of req.body.deleteImages){
            await cloudinary.v2.uploader.destroy(filename,function(err,res){
                console.log(res);
            
                });}

        await newStat.updateOne({ $pull: { Images: { filename: { $in : req.body.deleteImages[0]}}}})
    }
   
    res.redirect(`/station/${newStat._id}`)    
}



module.exports.delete = async (req,res)=>{
    const {id}= req.params;
    await  Station.findByIdAndDelete(id)
    req.flash('error','successfully Deleted the Station')
    res.redirect('/station')    
}