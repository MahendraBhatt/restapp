//Dependencies
var express = require('express');
var router = express.Router();

//Models
var Product = require('../models/product');

//Routes
Product.methods(['get', 'put', 'post', 'delete']);

//Before example
Product.before('post', function(req, res, next) {
  console.log("before product is added");
  console.log(req.data);
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

Product.register(router, '/products');

//Return router
module.exports = router;

/*
Usage 
http://localhost:3001/api/products/
http://localhost:3001/api/products/?limit=5
http://localhost:3001/api/products/?name__regex=/^mah/i
*/