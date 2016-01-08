//------------------------------------------------------------------------------------------------------------
//										Dependencies
//------------------------------------------------------------------------------------------------------------

var fs = require('fs');
var schema = require('./schema/'+process.argv[2]+'.js');
var name = schema.name;

//------------------------------------------------------------------------------------------------------------
//									Generating Mongoose Model
//------------------------------------------------------------------------------------------------------------
function getMongooseSchema(columns) {
	var mongooseSchema = {};
	columns.forEach(function (element, index, array) {
		mongooseSchema[element.name] = element.type;
	});
	return JSON.stringify(mongooseSchema, null, '\t');
}

fs.readFile('template/model.txt', 'utf8', function (err, data) {
	var model = data;
	var newmodel = model.replace(/{{name}}/g, name.toLowerCase())
		.replace(/{{camelized-name}}/g, name)
		.replace(/{{schema}}/g, getMongooseSchema(schema.columns));
	fs.writeFile('../models/' + name.toLowerCase() + '.js', newmodel, function (err) {
		if (err) throw err;
		console.log(name + ' Model Created!');
	});
});

//------------------------------------------------------------------------------------------------------------
//								Generating REST API for created Mongoose Model
//------------------------------------------------------------------------------------------------------------
	 
function getQueryWhereCondition(columns) {
	var queryWhereCondition = '';
	columns.filter(function (obj) {
		return obj.searchable;
	})
	.forEach(function (element, index, array) {
		if(element.type === 'Date'){
			queryWhereCondition += '\tif(req.query.From'+element.name+' !== undefined || req.query.To'+element.name+' !== undefined){\r'+
									'\t\t\t\tquery.'+element.name+' = {};\r'+
									'\t\t\t\tif(req.query.From'+element.name+'){ query.'+element.name+'.$gte = req.query.From'+element.name+'; }\r'+
									'\t\t\t\tif(req.query.To'+element.name+'){ query.'+element.name+'.$lte = req.query.To'+element.name+'; }\r'+
									'\t}\r';
		} else {
			queryWhereCondition += '\t\tquery.' + element.name + ' = new RegExp(req.query.' + element.name + ', "i");\r';
		}
	});
	return queryWhereCondition;
}

fs.readFile('template/api.txt', 'utf8', function (err, data) {
	var restapi = data;
	var newrestapi = restapi.replace(/{{name}}/g, name.toLowerCase())
		.replace(/{{camelized-name}}/g, name)
		.replace(/{{queryWhereCondition}}/g, getQueryWhereCondition(schema.columns));
	fs.writeFile('../routes/' + name.toLowerCase() + '-api.js', newrestapi, function (err) {
		if (err) throw err;
		console.log(name + ' API Created!');
	});
});

//------------------------------------------------------------------------------------------------------------
//								Generating HTML for created Mongoose Model
//------------------------------------------------------------------------------------------------------------

function getGridColumns(columns) {
	var gridDisplayColumns = '', gridHeaderColumns = '';
	columns.filter(function (obj) {
				return obj.showInGrid;
			})
			.forEach(function (element, index, array) {
				gridDisplayColumns += '<div class="col-1">${'+
                                        (element.type === 'Date' ? 'app.formatDate('+element.name+')' :  element.name )
                                        +'}</div>';
				gridHeaderColumns += '<div class="col-1">'+
									(element.sortable ? '<a href="#" data-sort-expression="' + element.name +
														'" data-sort-order="none">'+element.name+'</a>' 
														: element.name)
									 +'</div>';
				if (index + 1 < array.length) {
					gridDisplayColumns += '\r\t\t\t';
					gridHeaderColumns += '\r\t\t\t';
				}
			});
	return { header: gridHeaderColumns, display: gridDisplayColumns};
}

function getInputType(systemType){
	if(systemType == 'Number' || systemType == 'Double'){
		return 'number';
	}// else if(systemType == 'Date'){
		//return 'date';
	//}
	return 'text';
}

function getSearchControls(columns){
	var searchControls = '';
	columns.filter(function (obj) {
				return obj.searchable;
			})
			.forEach(function (element, index, array) {
				var type = getInputType(element.type); 
				if(element.type === 'Date'){
					searchControls += '<div class="col-1 right">From '+element.name+'</div>\r\t\t\t' 
									+ '<div class="col-2"><input class="calendar" id="search_From'+element.name+'" /></div>'
									+ '<div class="col-1 right">To '+element.name+'</div>\r\t\t\t' 
									+ '<div class="col-2"><input class="calendar" id="search_To'+element.name+'" /></div>';
				}else{
					searchControls += '<div class="col-1 right">'+element.name+'</div>\r\t\t\t' 
									+ '<div class="col-2"><input type="'+type+'" id="search_'+element.name+'" /></div>';
				}		
				if (index + 1 < array.length) {
					searchControls += '\r\t\t\t';
				}
			});
	return searchControls;
}

function getFormControls(columns){
	var formControls = '';
	columns.forEach(function (element, index, array) {
				var type = getInputType(element.type); 
				formControls += '<div class="row">\r\t\t\t<div class="col-4 right">'+element.name+'</div>\r\t\t\t' 
									+ '<div class="col-4 left"><input type="'+type+'" name="'+element.name+'" '+(element.type === 'Date' ? 'class="calendar" value="${app.formatDate('+element.name+')}"' : ' value="${'+element.name+'}" ')+' /></div>\r\t\t</div>';
				if (index + 1 < array.length) {
					formControls += '\r\t\t';
				}
			});
	return formControls;
}
 
fs.readFile('template/html.txt', 'utf8', function (err, data) {
	var html = data;
	var gridColumns = getGridColumns(schema.columns);
	var newhtml = html.replace(/{{name}}/g, name.toLowerCase())
		.replace(/{{camelized-name}}/g, name)
		.replace(/{{namespace}}/g, schema.namespace)
		.replace(/{{grid-display-columns}}/g, gridColumns.display)
		.replace(/{{grid-header-columns}}/g, gridColumns.header)
		.replace(/{{search-controls}}/g, getSearchControls(schema.columns))
		.replace(/{{form-input-controls}}/g, getFormControls(schema.columns));
	fs.writeFile('../html/' + name.toLowerCase() + '.html', newhtml, function (err) {
		if (err) throw err;
		console.log(name + ' HTML Created!');
	});
});

//------------------------------------------------------------------------------------------------------------
//								Generating JS for created Mongoose Model
//------------------------------------------------------------------------------------------------------------

function generateSearchQueryString(columns){
	var searchQueryString = '';
	columns.filter(function (obj) {
				return obj.searchable;
			})
			.forEach(function (element, index, array) {
				var separator = index == 0 ? '' : '&';
				if(element.type === 'Date'){
					searchQueryString += 'if ($("#search_From' + element.name + '").val() !== \'\') {\r\t\t\t' +
										 'search += \'' + separator + 'From' + element.name + '=\' + $("#search_From' + element.name + '").val();\r\t\t}\r\t\t' +
										 'if ($("#search_To' + element.name + '").val() !== \'\') {\r\t\t\t' +
										 'search += \'' + separator + 'To' + element.name + '=\' + $("#search_To' + element.name + '").val();\r\t\t}\r\t\t';
				} else {
					searchQueryString += 'if ($("#search_' + element.name + '").val() !== \'\') {\r\t\t\t' +
										 'search += \'' + separator + element.name + '=\' + $("#search_' + element.name + '").val();\r\t\t}\r\t\t';
				}
			});
	return searchQueryString;
}

function getDateFields(columns){
    var dateFields = '';
    columns.filter(function (obj) {
				return obj.type === 'Date';
			}).forEach(function(element, index, array){
                dateFields += element.name + ': \'\'';
                if (index + 1 < array.length) {
					dateFields += ', ';
				}
            });
    return dateFields;    
}

fs.readFile('template/js.txt', 'utf8', function (err, data) {
	var js = data;
	var newjs = js.replace(/{{name}}/g, name.toLowerCase())
        .replace(/{{date-fields}}/g, getDateFields(schema.columns))
		.replace(/{{camelized-name}}/g, name)
		.replace(/{{namespace}}/g, schema.namespace)
		.replace(/{{search-query-string}}/g, generateSearchQueryString(schema.columns));
	fs.writeFile('../js/page/' + name.toLowerCase() + '.js', newjs, function (err) {
		if (err) throw err;
		console.log(name + ' JS Created!');
	});
});

//------------------------------------------------------------------------------------------------------------
//								End of Code Generation
//------------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------
//								Injecting Api Line in main app.js
//------------------------------------------------------------------------------------------------------------

fs.readFile('../app.js', 'utf8', function (err, data) {
	var appJs = data.split('\n');
	var lineNumber = appJs.indexOf('\/\/Routes\r')+1;
	if(appJs.indexOf("app.use(\'/api\', require(\'./routes/" + name.toLowerCase() + "-api\'));\r") < 0){
		appJs.splice(lineNumber, 0, "app.use(\'/api\', require(\'./routes/" + name.toLowerCase() + "-api\'));\r");
		var text = appJs.join("\n");
		fs.writeFile('../app.js', text, function (err) {
			if (err) throw err;
			console.log(name + ' Api Line Injected!');
		});
	}
});

//------------------------------------------------------------------------------------------------------------
//								 End of Api Line Injection
//------------------------------------------------------------------------------------------------------------
