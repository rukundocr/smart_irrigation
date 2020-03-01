const express = require('express');
const app = express();
const morgan = require('morgan');

//use it
app.use(morgan('dev'));
// Routes which should handle reques
// import body-parser
const bodyParser = require('body-parser');
// let's use it
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//app.use(cors())
const courseRoutes  = require('./route/course');

app.use("/", courseRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/course:id', courseRoutes);
app.use('/api/course/new', courseRoutes);

module.exports    = app;
   

