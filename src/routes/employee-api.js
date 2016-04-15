//Dependencies
var express = require('express');
var router = express.Router();

//Models
var Employee = require('../models/employee');

//---------------------------------------------------
//  Employees api
//---------------------------------------------------

function getWhereCondition(req){
  var query = {};
  	query.EmpNo = new RegExp(req.query.EmpNo, "i");	query.FirstName = new RegExp(req.query.FirstName, "i");	if(req.query.FromHireDate !== undefined || req.query.ToHireDate !== undefined){				query.HireDate = {};				if(req.query.FromHireDate){ query.HireDate.$gte = req.query.FromHireDate; }				if(req.query.ToHireDate){ query.HireDate.$lte = req.query.ToHireDate; }	}	if(req.query.Gender !== '0'){		query.Gender = req.query.Gender;	}	if(req.query.Region !== '0'){		query.Region = req.query.Region;	}	if(req.query.FromBirthDate !== undefined || req.query.ToBirthDate !== undefined){				query.BirthDate = {};				if(req.query.FromBirthDate){ query.BirthDate.$gte = req.query.FromBirthDate; }				if(req.query.ToBirthDate){ query.BirthDate.$lte = req.query.ToBirthDate; }	}
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
Employee.EmployeeRESTModel.methods(['post', 'put', 'delete']);

// Customizing get method so that all records are not fetched at one time
// Use .populate(foreigntablename) to fill foreign table values in query after find 
Employee.EmployeeRESTModel.route('get', function (req, res, next) {
   Employee.Employee.find(getWhereCondition(req))
    .populate('Region').skip(parseInt(req.query.skip, 10))
                  .limit(parseInt(req.query.limit, 10))
                  .sort(getSortExpression(req))
                  .exec(function (err, employee) {
                      res.send(employee);
                  });
});

//Custom route example with only get
Employee.EmployeeRESTModel.route('count', function (req, res, next) {
  Employee.EmployeeRESTModel.count(getWhereCondition(req), function (err, count) {
    res.send((count || 0).toString());
  });
});

//Register employees api for routing
Employee.EmployeeRESTModel.register(router, '/employees');

//---------------------------------------------------
//  End of Employees api
//---------------------------------------------------

//Return router
module.exports = router;
 