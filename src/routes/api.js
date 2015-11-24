//Dependencies
var express = require('express');
var router = express.Router();

//Models
var Product = require('../models/product');
var Manufacturer = require('../models/manufacturer');
var Region = require('../models/region');

//---------------------------------------------------
//  Products api
//---------------------------------------------------

//Routes
Product.methods(['get', 'put', 'post', 'delete']);

//Before example
Product.before('post', function(req, res, next) {
  console.log("before product is added");
  next();
});

//after example
Product.after('post', function(req, res, next) {
  console.log("after product is added");
  next();
});

//Custom route example 
Product.route('isDuplicate', function(req, res, next) {
  res.send('Not a duplicate!');
});

//Custom route example with only get
Product.route('isAvailable.get', function(req, res, next) {
  res.send('Yes I am available!');
});

//Custom route example with only get
Product.route('count', function(req, res, next) {
    Product.count(function (err, count) {
        res.send(count.toString());
    });
});

//Register products api for routing
Product.register(router, '/products');

//---------------------------------------------------
//  End of Products api
//---------------------------------------------------

//---------------------------------------------------
//  Manufacturers api
//---------------------------------------------------

//Routes
Manufacturer.methods(['get', 'put', 'post', 'delete']);

//Custom route example with only get
Manufacturer.route('count', function(req, res, next) {
    Manufacturer.count(function (err, count) {
        res.send(count.toString());
    });
});

//Register manufacturer api for routing
Manufacturer.register(router, '/manufacturers');

//---------------------------------------------------
//  End of Manufacturers api
//---------------------------------------------------

//---------------------------------------------------
//  Regions api
//---------------------------------------------------

//Routes
Region.methods(['get', 'put', 'post', 'delete']);

//Custom route example with only get
Region.route('count', function(req, res, next) {
    Region.count(function (err, count) {
        res.send(count.toString());
    });
});

//Register manufacturer api for routing
Region.register(router, '/regions');

//---------------------------------------------------
//  End of Manufacturers api
//---------------------------------------------------


//Return router
module.exports = router;

/*
Usage 
http://localhost:3001/api/products/
http://localhost:3001/api/products/?limit=5
http://localhost:3001/api/products/?name__regex=/^mah/i
*/