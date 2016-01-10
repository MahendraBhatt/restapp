//------------------------------------------------------------------------------------------------------------
//										Dependencies
//------------------------------------------------------------------------------------------------------------

var fs = require('fs');
var schema = require('./schema/'+process.argv[2]+'.js');
var name = schema.name;

// generates keyboard tab keys for given count
function generateKeyTabs(n, keyTabs){
    keyTabs = keyTabs || '';
    return (n > 0) ? generateKeyTabs(n - 1, keyTabs + '\t') : keyTabs; 
}

//------------------------------------------------------------------------------------------------------------
//									Generating Mongoose Model
//------------------------------------------------------------------------------------------------------------
function getMongooseSchema(columns) {
	var mongooseSchema = '{';
	columns.forEach(function (element, index, array) {
        if(element.type === 'Reference'){
            mongooseSchema += element.name + ': { type: Schema.Types.ObjectId, ref: \''+element.referenceFrom+'\' }';    
        } else {
            mongooseSchema += element.name + ': \''+ element.type + '\'';    
        }
        if (index + 1 < array.length) {
            mongooseSchema += ',\r\t';
        }
	});
    mongooseSchema += '}';
	return mongooseSchema;
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
            if(element.referenceFrom === undefined){
                queryWhereCondition += '\tquery.' + element.name + ' = new RegExp(req.query.' + element.name + ', "i");\r';    
            } else {
                queryWhereCondition += '\tif(req.query.' + element.name + ' !== \'0\'){\r\t\tquery.' + element.name + ' = req.query.' + element.name + ';\r\t}\r';
            }
		}
	});
	return queryWhereCondition;
}

function getPopulateForeignReferences(columns){
    var populateForeignReferences = '';
	columns.filter(function (obj) {
		return obj.referenceFrom !== undefined && obj.type === 'Reference';
	})
	.forEach(function (element, index, array) {
		populateForeignReferences += '.populate(\''+element.referenceFrom+'\')';
	});
	return populateForeignReferences;
}

fs.readFile('template/api.txt', 'utf8', function (err, data) {
	var restapi = data;
	var newrestapi = restapi.replace(/{{name}}/g, name.toLowerCase())
		.replace(/{{camelized-name}}/g, name)
        .replace(/{{populate-foreign-references}}/g, getPopulateForeignReferences(schema.columns))
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
                if(element.type === 'Reference'){
                    gridDisplayColumns += '<div class="col-1">${'+element.name+'.'+element.referenceFieldName+'}</div>';
                }else{
				    gridDisplayColumns += '<div class="col-1">${'+
                                        (element.type === 'Date' ? 'app.formatDate('+element.name+')' :  element.name )
                                        +'}</div>';
                }
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
                //referenceFrom
				var type = getInputType(element.type);

                if(element.type === 'Date'){
                    searchControls += '<div class="col-1 right">From '+element.name+'</div>\r\t\t\t' 
                                    + '<div class="col-2"><input autocomplete="off" class="calendar" id="search_From'+element.name+'" /></div>'
                                    + '<div class="col-1 right">To '+element.name+'</div>\r\t\t\t' 
                                    + '<div class="col-2"><input autocomplete="off" class="calendar" id="search_To'+element.name+'" /></div>';
                }else{
                    searchControls += '<div class="col-1 right">'+element.name+'</div>\r\t\t\t';
                    if(element.referenceFrom === undefined) {
                        searchControls += '<div class="col-2"><input autocomplete="off" type="'+type+'" id="search_'+element.name+'" /></div>';
                    }else{
                        searchControls += '<div class="col-2"><select id="search_'+element.name+'"></select></div>';
                    }	
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
        //referenceFrom
				var type = getInputType(element.type); 
				formControls += '<div class="row">\r\t\t\t<div class="col-4 right">'+element.name+'</div>\r\t\t\t'; 
          		if(element.referenceFrom === undefined) {
                    formControls += '<div class="col-4 left"><input autocomplete="off" type="'+type+'" name="'+element.name+'" '+(element.type === 'Date' ? 'class="calendar" value="${app.formatDate('+element.name+')}"' : ' value="${'+element.name+'}" ')+' /></div>';
                }else{
                    formControls += '<div class="col-4 left"><select name="'+element.name+'">{{tmpl('+schema.namespace+'.'+name.toLowerCase()+'.'+element.name.toLowerCase()+'s, {selectedId: '+element.name+'}) "#'+element.name+'Template"}}</select></div>';  
                }
                formControls += '\r\t\t</div>';
				if (index + 1 < array.length) {
					formControls += '\r\t\t';
				}
			});
	return formControls;
}

function getReferenceInputTemplates(columns){
    var referenceInputTemplates = '';
	columns.filter(function (obj) {
				return obj.referenceFrom !== undefined;
			}).forEach(function (element, index, array) {
        //referenceFrom
                //type = Reference
				referenceInputTemplates += '<script id="'+element.name+'Template" type="text/x-jQuery-tmpl">\r\t\t';
                if(element.type === 'Reference'){
                    referenceInputTemplates += '<option value="${_id}" {{if _id === $item.selectedId}}selected="selected" {{/if}}>${'+element.referenceFieldName+'}</option>\r\t';
                } else {
                    referenceInputTemplates += '<option value="${'+element.referenceFieldName+'}" {{if '+element.referenceFieldName+' === $item.selectedId}}selected="selected" {{/if}}>${'+element.referenceFieldName+'}</option>\r\t';    
                }
	            referenceInputTemplates += '</script>\r\t';
			});
	return referenceInputTemplates;
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
		.replace(/{{form-input-controls}}/g, getFormControls(schema.columns))
        .replace(/{{reference-input-templates}}/g, getReferenceInputTemplates(schema.columns));
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

function getDateNReferenceFields(columns){
    var dateFields = '';
    columns.filter(function (obj) {
				return obj.type === 'Date' || obj.referenceFrom !== undefined;
			}).forEach(function(element, index, array){
                dateFields += element.name + ': \'\'';
                if (index + 1 < array.length) {
					dateFields += ', ';
				}
            });
    return dateFields;    
}

function generateReferenceFieldLoadMethods(columns){
    var referenceFieldLoadMethods = '';
    columns.filter(function (obj) {
				return obj.referenceFrom !== undefined;
			}).forEach(function(element, index, array){
                referenceFieldLoadMethods += ',\r\t'
                                              + element.name.toLowerCase()+'s: {},\r\t'
                                              + 'load'+element.name+'s: function(next){\r\t\t'
                                              + 'app.XHR().call({\r\t\t\t'
                                              + 'url: "'+element.name.toLowerCase()+'s",\r\t\t\t'
                                              + 'success: function (res) {\r\t\t\t\t'
                                              + schema.namespace+'.'+name.toLowerCase()+'.'+element.name.toLowerCase()+'s = res;\r\t\t\t\t'
                                              + 'app.fillDropDown(\'search_'+element.name+'\', '
                                              + schema.namespace+'.'+name.toLowerCase()+'.'+element.name.toLowerCase()+'s'
                                              + (element.type === 'Reference' ? '' : ', \''+element.referenceFieldName+'\'')+');\r\t\t\t\t'
                                              + 'next();\r\t\t\t'
                                              + '}\r\t\t});\r\t}';
            });
    return referenceFieldLoadMethods;   
}

function generateCallReferenceFieldLoadMethods(columns){
    var start = '', end = '';
    columns.filter(function (obj) {
				return obj.referenceFrom !== undefined;
			}).forEach(function(element, index, array){
                start += schema.namespace+'.'+name.toLowerCase()+'.load'+element.name+'s(function(){\r' + generateKeyTabs(index + 2);
                end += generateKeyTabs(1) + '});';
                if (index + 1 < array.length) {
                    end += '\r';
				}
            });
    return {start: start, end: end};    
}
fs.readFile('template/js.txt', 'utf8', function (err, data) {
	var js = data;
    var callReferenceLoadMethods = generateCallReferenceFieldLoadMethods(schema.columns);
	var newjs = js.replace(/{{name}}/g, name.toLowerCase())
        .replace(/{{date-n-reference-fields}}/g, getDateNReferenceFields(schema.columns))
		.replace(/{{camelized-name}}/g, name)
		.replace(/{{namespace}}/g, schema.namespace)
		.replace(/{{search-query-string}}/g, generateSearchQueryString(schema.columns))
        .replace(/{{reference-field-load-methods}}/g, generateReferenceFieldLoadMethods(schema.columns))
        .replace(/{{call-reference-field-load-methods-start}}/g, callReferenceLoadMethods.start)
        .replace(/{{call-reference-field-load-methods-end}}/g, callReferenceLoadMethods.end);
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
