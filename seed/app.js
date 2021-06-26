
const mongoose = require('mongoose')
const Station = require('../models/Stations')
const cities = require('./cities')
const {first ,second} = require('./title')

mongoose.connect('mongodb://localhost:27017/project', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log('something from the mongoose')
})
.catch(e=>{
    console.log('error from the mongoose')
    console.log(e)
})

const sample = array =>array[Math.floor(Math.random()*array.length)]

const seedDb = async () =>{
    await Station.deleteMany({});
    for(i=0;i<50; i++){
        const random = Math.floor(Math.random() *41)
        const price = Math.floor(Math.random() *2000)+500;
        const city = new Station({
            author : '60c86046906f063bec493cb9',
            geometry: {
                type : 'Point', 
                coordinates : [ 
                    cities[random].longitute,
                    cities[random].latitude,
                 ]
             },
            location: `${cities[random].name},${cities[random].state}`,
            title : `${sample(first)} ${sample(second)}`,
            description:'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae voluptatum adipisci suscipit minus animi error soluta, magnam harum accusantium quaerat aspernatur eum impedit exercitationem atque architecto dolorum natus aut quo?',
            price,
            Images:[ {
               
                url: 'https://res.cloudinary.com/dmek8gyke/image/upload/v1623859500/Station/swo3teaylnst7kjmlp3t.jpg',
                filename: 'Station/swo3teaylnst7kjmlp3t'
              },
              {
                
                url: 'https://res.cloudinary.com/dmek8gyke/image/upload/v1623859509/Station/gkwiezwgfgwflqrbgm6q.jpg',
                filename: 'Station/gkwiezwgfgwflqrbgm6q'
              }
            ]
})

        await city.save();
        
    }
}


seedDb(); 