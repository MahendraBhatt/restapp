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
	res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Credentials", false);
    res.header("Access-Control-Max-Age", "86400"); // 24 hours
	next();
});
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Routes
app.use('/api', require('./routes/gender-api'));
app.use('/api', require('./routes/order-api'));
app.use('/api', require('./routes/product-api'));
app.use('/api', require('./routes/region-api'));
app.use('/api', require('./routes/employee-api'));

//Serving static files with express
app.use('/', express.static('html'));
app.use('/js', express.static('js'));

module.exports = app;
