app.employee = {
    openInputPanelInModalDialog: true,
	count: function(){
		var search = '?';
		if ($("#search_EmpNo").val() !== '') {			search += 'EmpNo=' + $("#search_EmpNo").val();		}		if ($("#search_FirstName").val() !== '') {			search += '&FirstName=' + $("#search_FirstName").val();		}		if ($("#search_FromHireDate").val() !== '') {			search += '&FromHireDate=' + $("#search_FromHireDate").val();		}		if ($("#search_ToHireDate").val() !== '') {			search += '&ToHireDate=' + $("#search_ToHireDate").val();		}		if ($("#search_Gender").val() !== '') {			search += '&Gender=' + $("#search_Gender").val();		}		if ($("#search_Region").val() !== '') {			search += '&Region=' + $("#search_Region").val();		}		if ($("#search_FromBirthDate").val() !== '') {			search += '&FromBirthDate=' + $("#search_FromBirthDate").val();		}		if ($("#search_ToBirthDate").val() !== '') {			search += '&ToBirthDate=' + $("#search_ToBirthDate").val();		}		
		app.XHR().call({
			url: "employees/count/" + search,
			success: function (res) {
				$("#noOfEmployees").html(res);
				if (res > 0) {
					$("#EmployeeHeader,#EmployeeFooter,#EmployeeContainer").show();
					app.grid.sort({ count: res, source: 'EmployeeHeader', pager: '.footer', target: 'EmployeeContainer', callback: app.employee.load });
					app.grid.pager({ count: res, element: '.footer', target: 'EmployeeContainer', callback: app.employee.load }).build();
				} else {
					$('#EmployeeContainer').html('');
					$("#EmployeeHeader,#EmployeeFooter,#EmployeeContainer").hide();
				}
			}
		});
	},
	load: function(){
		var target = $('#EmployeeContainer');
		var search = '?';
		if ($("#search_EmpNo").val() !== '') {			search += 'EmpNo=' + $("#search_EmpNo").val();		}		if ($("#search_FirstName").val() !== '') {			search += '&FirstName=' + $("#search_FirstName").val();		}		if ($("#search_FromHireDate").val() !== '') {			search += '&FromHireDate=' + $("#search_FromHireDate").val();		}		if ($("#search_ToHireDate").val() !== '') {			search += '&ToHireDate=' + $("#search_ToHireDate").val();		}		if ($("#search_Gender").val() !== '') {			search += '&Gender=' + $("#search_Gender").val();		}		if ($("#search_Region").val() !== '') {			search += '&Region=' + $("#search_Region").val();		}		if ($("#search_FromBirthDate").val() !== '') {			search += '&FromBirthDate=' + $("#search_FromBirthDate").val();		}		if ($("#search_ToBirthDate").val() !== '') {			search += '&ToBirthDate=' + $("#search_ToBirthDate").val();		}		
		search += ('&skip={0}&limit={1}').format(target.data('skip'), target.data('limit'));
	
		if(target.data('sort-expression')){
			search += ('&s={0}&so={1}').format(target.data('sort-expression'), target.data('sort-order'));
		}
		
		app.XHR().call({
			url: "employees/" + search,
			success: function (res) {
				$('#EmployeeContainer').html('');
				//${( $data.index = $item.dataArrayIndex($item.data) ),''} Index: ${$data.index}
				$("#EmployeeGridTemplate").tmpl(res, {
					dataArrayIndex: function (item) {
						return $.inArray(item, res) + 1;
					}
				}).appendTo("#EmployeeContainer");
			}
		});
	},
	remove: function(id){
		var res = confirm('Are you sure?');
		if (res) {
			app.XHR().call({
				url: "employees/" + id,
				type: 'DELETE',
				success: function (res) {
					console.log('record deleted');
					app.employee.count();
				}
			});
		}
	},
    cancel: function(){
        if(app.employee.openInputPanelInModalDialog === true){
            $('#EmployeeInput .close').click();
        } else {
            $('#EmployeeRecordsFound').show();
            app.showHidePanel('EmployeeSearch','EmployeeInput');
        }
    },
	save: function(id){
		var data = $('#EmployeeInput').serializeObject();
		app.XHR().call({
			url: "employees/" + id,
			data: JSON.stringify(data),
			type: (id === '' ? 'POST' : 'PUT'),
			success: function (res) {
				console.log('record saved');
                if(app.employee.openInputPanelInModalDialog === true){
                    $('#EmployeeInput .close').click();
                } else {
                    $('#EmployeeRecordsFound').show();
                    app.showHidePanel('EmployeeSearch','EmployeeInput');
                }
				app.employee.count();
			}
		});
		return false;
	},
	showInput: function(row){
		var data = { _id: '', HireDate: '', Gender: '', Region: '', BirthDate: '' };
		if (row !== undefined) {
			data = $(row).tmplItem().data;
		}
		$("#EmployeeInput").html('');
		$("#EmployeeTemplate").tmpl(data).appendTo("#EmployeeInput");
        if(app.employee.openInputPanelInModalDialog === true){
            app.showModalDialog('EmployeeInput');
        } else {
            $('#EmployeeRecordsFound').hide();
            app.showHidePanel('EmployeeInput','EmployeeSearch');
        }
	},	genders: {},	loadGenders: function(next){		app.XHR().call({			url: "genders",			success: function (res) {				app.employee.genders = res;				app.fillDropDown('search_Gender', app.employee.genders, 'name');				next();			}		});	},	regions: {},	loadRegions: function(next){		app.XHR().call({			url: "regions",			success: function (res) {				app.employee.regions = res;				app.fillDropDown('search_Region', app.employee.regions);				next();			}		});	}
};

(function () {
    app.employee.loadGenders(function(){		app.employee.loadRegions(function(){			app.employee.count();
    	});	});
})();