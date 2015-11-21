//Dependencies
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

//MongoDB
mongoose.connect('mongodb://localhost/rest_test');

//Express
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Routes
app.use('/api', require('./routes/api'));

//Serving static files with express
app.use('/', express.static('html'));
app.use('/js', express.static('js'));


//Start server
app.listen(3000);
console.log('API is running on port 3000!');

/*
Usage 
http://localhost:3000/api/products/
http://localhost:3000/api/products/?limit=5
http://localhost:3000/api/products/?name__regex=/^mah/i
*/