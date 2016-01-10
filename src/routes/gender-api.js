//Dependencies
var express = require('express');
var router = express.Router();

//Models
var Gender = require('../models/gender');

//---------------------------------------------------
//  Genders api
//---------------------------------------------------

function getWhereCondition(req){
  var query = {};
  		query.name = new RegExp(req.query.name, "i");
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
Gender.GenderRESTModel.methods(['post', 'put', 'delete']);

// Customizing get method so that all records are not fetched at one time
// Use .populate(foreigntablename) to fill foreign table values in query after find 
Gender.GenderRESTModel.route('get', function (req, res, next) {
   Gender.Gender.find(getWhereCondition(req))
                  .skip(req.query.skip)
                  .limit(req.query.limit)
                  .sort(getSortExpression(req))
                  .exec(function (err, gender) {
                      res.send(gender);
                  });
});

//Custom route example with only get
Gender.GenderRESTModel.route('count', function (req, res, next) {
  Gender.GenderRESTModel.count(getWhereCondition(req), function (err, count) {
    res.send((count || 0).toString());
  });
});

//Register genders api for routing
Gender.GenderRESTModel.register(router, '/genders');

//---------------------------------------------------
//  End of Genders api
//---------------------------------------------------

//Return router
module.exports = router;
 