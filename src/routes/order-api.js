//Dependencies
var express = require('express');
var router = express.Router();

//Models
var Order = require('../models/order');

//---------------------------------------------------
//  Orders api
//---------------------------------------------------

function getWhereCondition(req){
  var query = {};
  query.No = new RegExp(req.query.No, "i");
  if(req.query.FromDate !== undefined || req.query.ToDate !== undefined){
	   query.Date = {};
     if(req.query.FromDate){
       query.Date.$gte = req.query.FromDate;
     }
     if(req.query.ToDate){
       query.Date.$lte = req.query.ToDate;
     }
  }
  //following is example of expandable where condition 
  //for e.g. you have a value for search and it is optional for search
  /*
   if (req.query.region !== '0') {
     query.region = req.query.region;
   }
  */
  return query;
}

function getSortExpression(req){
  var sortExpression = {};
  if(req.query.s){
    sortExpression[req.query.s] = req.query.so == 'asc' ? 1 : -1;
  }
  return sortExpression;
}

//Routes
Order.OrderRESTModel.methods(['post', 'put', 'delete']);

// Customizing get method so that all records are not fetched at one time
// Use .populate(foreigntablename) to fill foreign table values in query after find 
Order.OrderRESTModel.route('get', function (req, res, next) {
   Order.Order.find(getWhereCondition(req))
                  .skip(req.query.skip)
                  .limit(req.query.limit)
                  .sort(getSortExpression(req))
                  .exec(function (err, order) {
                      res.send(order);
                  });
});

//Custom route example with only get
Order.OrderRESTModel.route('count', function (req, res, next) {
  Order.OrderRESTModel.count(getWhereCondition(req), function (err, count) {
    res.send((count || 0).toString());
  });
});

//Register orders api for routing
Order.OrderRESTModel.register(router, '/orders');

//---------------------------------------------------
//  End of Orders api
//---------------------------------------------------

//Return router
module.exports = router;
 