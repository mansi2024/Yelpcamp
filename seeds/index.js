const mongoose = require('mongoose');
const {places, descriptors} = require('./seedhelpers');
const cities = require('./cities');
const Campground = require('../model/campground');

mongoose.connect('mongodb://localhost:27017/yelpcamp',{
  useUnifiedTopology:true,
  useNewUrlParser:true,
  useCreateIndex:true,
  useFindAndModify:false  
})
.then(()=>{
    console.log('Database Connected');
})
.catch((err)=>{
  console.log("connection error");
  console.log(err);
})


const sample = array=> array[Math.floor(Math.random() * array.length)];
const price =Math.floor(Math.random() * 30)+20

const seedDb = async()=>{
    await Campground.deleteMany({});
   for(let i=0 ; i<200 ; i++){
       const rand1000 = Math.floor(Math.random()*1000);
       const camp = new Campground({
           author:'60f3e05ec29faf0c84b4bf83',
           location : `${cities[rand1000].city},${cities[rand1000].state}`,
           title : `${sample(descriptors)} ${sample(places)}`,
           geometry:{
             type:'Point',
             coordinates:[
                  cities[rand1000].longitude,
                  cities[rand1000].latitude
             ]
           },
           description:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nobis omnis distinctio beatae ipsum.Laborum excepturi enim maxime facilis nihil, tempore nisi quia aliquid explicabo, quos nam quisquam quod. Enim, impedit.',
           price,
          images:[
            {
              
              url: 'https://res.cloudinary.com/de7cjzirt/image/upload/v1626697691/Yelpcamp/njggdyianybfbbpokebu.jpg',
              filename: 'Yelpcamp/njggdyianybfbbpokebu'
            },
            {
             
              url: 'https://res.cloudinary.com/de7cjzirt/image/upload/v1626697698/Yelpcamp/bmzpyq55bsdf6vci8wwg.jpg',
              filename: 'Yelpcamp/bmzpyq55bsdf6vci8wwg'
            }
          ]
       })
       await camp.save();
   }
}
seedDb();

