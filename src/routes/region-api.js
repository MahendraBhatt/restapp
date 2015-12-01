//Dependencies
var express = require('express');
var router = express.Router();

//Models
var Region = require('../models/region');
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