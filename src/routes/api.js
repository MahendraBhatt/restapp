//Dependencies
var express = require('express');
var router = express.Router();

//Models
var Region = require('../models/region');
var Product = require('../models/product');

//---------------------------------------------------
//  Products api
//---------------------------------------------------

function getWhereCondition(req){
  var query = { name: new RegExp(req.query.name, "i") };
  if (req.query.region !== '0') {
    query.region = req.query.region;
  }
  return query;
}

function getSortExpression(req){
  var sortExpression = {};
  if(req.query.s){
    sortExpression[req.query.s] = req.query.so == 'asc' ? 1 : -1;
    console.log(sortExpression);
  }
  return sortExpression;
}

//Routes
Product.ProductRESTModel.methods(['post', 'put', 'delete']);

Product.ProductRESTModel.route('get', function (req, res, next) {
   Product.Product.find(getWhereCondition(req))
                  .populate('region')
                  .skip(req.query.skip)
                  .limit(req.query.limit)
                  .sort(getSortExpression(req))
                  .exec(function (err, product) {
    res.send(product);
  })
});

//Custom route example 
Product.ProductRESTModel.route('isDuplicate', function (req, res, next) {
  res.send('Not a duplicate!');
});

//Custom route example with only get
Product.ProductRESTModel.route('isAvailable.get', function (req, res, next) {
  res.send('Yes I am available!');
});

//Custom route example with only get
Product.ProductRESTModel.route('count', function (req, res, next) {
  Product.ProductRESTModel.count(getWhereCondition(req), function (err, count) {
    res.send(count.toString());
  });
});

//Register products api for routing
Product.ProductRESTModel.register(router, '/products');

//---------------------------------------------------
//  End of Products api
//---------------------------------------------------

//---------------------------------------------------
//  Regions api
//---------------------------------------------------

//Routes
Region.methods(['get', 'put', 'post', 'delete']);

//Custom route example with only get
Region.route('count', function (req, res, next) {
  Region.count(function (err, count) {
    res.send(count.toString());
  });
});

//Register manufacturer api for routing
Region.register(router, '/regions');

//---------------------------------------------------
//  End of Region api
//---------------------------------------------------
 
//Return router
module.exports = router;
 
/*
Usage 
http://localhost:3001/api/products/
http://localhost:3001/api/products/?limit=5
http://localhost:3001/api/products/?name__regex=/^mah/i
*/