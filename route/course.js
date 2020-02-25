const express = require('express');
const app = express();
const Joi = require('joi');
const router = express.Router();
///const cors = require('cors');
const mongoose= require('mongoose');
const Thingdata = require('./models/thing.js')
app.use(express.json());
//app.use(cors());
 mongoose.connect('mongodb+srv://rukundo:N0HtpmtxjnR2vYE8@cluster0-bg7kr.mongodb.net/test?retryWrites=true',{ useUnifiedTopology: true, useNewUrlParser: true})
//mongoose.connect('mongodb://localhost:27017/stuffdb',{ useUnifiedTopology: true, useNewUrlParser: true })
.then(() => {
    console.log('Successfully connected to local MongoDB )!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB !');
    console.error(error);
  });
//cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content,Accept,Content-Type,Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  next();
     });
const courses = [
    {id:1 , name : "course1"},
    {id:2 , name :"course2 "}, 
    {id:3 , name :"course3 "},
    {id:4 , name :"course4 "}
]
router.get("/", (req, res,next) => {
    res.send ("WELCOME TO COURSES ");
   });
router.get("/api/course", (req,res,next) => {
 res.send (courses);
});

// route to get data from SENSOR NODE (nodemcu)
router.post("/post",(req,res)=>{
  const  data  =  new Thingdata({
    moisture:req.body.moisture,
    temp: req.body.temp,
    humidity: req.body.humidity,
    pump_status:req.body.pump_status,
    update:Date.now()
  });
 console.log(data);
  data.save().then(()=>{
    res.status(201).json({message:'post saaved successfuly'})
  }).catch((error)=>{
    res.status(401).json({message:error})
  });
 
});

//get last sensor data feed
router.get('/getlatest',(req,res)=>{
  Thingdata.find().sort({updated:-1}).limit(1)
  .then((data)=>{
    res.json(data).status(200);
  }).catch((error)=>{
    res.json({message:error});
  });
})

//get all sensor data feeds
router.get('/getall',(req,res)=>{
  Thingdata.find().sort({updated:-1})
  .then((data)=>{
    res.json(data).status(200);
  }).catch((error)=>{
    res.json({message:error});
  });
})
//delete sensor data 
router.delete('/data/:id',(req,res,next)=>{
  Thingdata.deleteOne({_id: req.params.id}).then(
       () => {
         res.status(200).json({
           message: 'Deleted!'
         });
       }
     ).catch(
       (error) => {
         res.status(400).json({
           error: error
         });
       }
     );
});
//delete sensor data records 
router.delete('/data',(req,res,next)=>{
  Thingdata.remove().then(
       () => {
         res.status(200).json({
           message: 'Deleted!'
         });
       }
     ).catch(
       (error) => {
         res.status(400).json({
           error: error
         });
       }
     );

});
router.post("/api/course/", (req,res,next) => {
    const {error} = valideteCourse(req.body);

    // if invalid, return 400 -bad request
    if(error) {
    return  res.status(400).send(result.error.details[0].message);
    
     };
    const course = {
        id:courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
    });

router.get("/api/course/:id", (req,res,next) => {

    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course)  return res.status(404).send("the course with this particular ID is not found");
    res.send(course);
   });
 
  router.put('/api/course/:id', (req,res) =>{
      //look at the course. if not exist returm 404
      const course = courses.find(c => c.id === parseInt(req.params.id));
      if(!course) return res.status(404).send("the course with this particular ID is not found"); 

      //validate the course
      
 const {error} = validateCourse(req.body);

   // if invalid, return 400 -bad request
   if(error) {
    return res.status(400).send(result.error.details[0].message);
    };

  
   //update the course
   course.name = req.body.name;
   res.send(course);
});
router.delete('/api/course/:id',(req,res)=>{

   // return the updated course to the client 
   //look for the course
   const course = courses.find(c => c.id === parseInt(req.params.id));
   //not exist return with 404
   if(!course) return  res.status(404).send("the course with this particular ID is not found"); 
   //delete it 
  const index = courses.indexOf(course);
  courses.splice(index,1);
  res.send(course);
});
 

  function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()     
     };
   return  Joi.validate(course, schema);
  };

   module.exports =  router ;