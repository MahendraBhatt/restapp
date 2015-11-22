//Dependencies
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

//MongoDB
mongoose.connect('mongodb://localhost/rest_test');

//Express
var app = express();

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "http://localhost:3000");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Routes
app.use('/api', require('./routes/api'));

//Serving static files with express
app.use('/', express.static('html'));
app.use('/js', express.static('js'));

module.exports = app;

/*
Usage 
http://localhost:3001/api/products/
http://localhost:3001/api/products/?limit=5
http://localhost:3001/api/products/?name__regex=/^mah/i
*/