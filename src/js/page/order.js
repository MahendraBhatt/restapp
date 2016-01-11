app.order = {
    openInputPanelInModalDialog: true,
	count: function(){
		var search = '?';
		if ($("#search_No").val() !== '') {			search += 'No=' + $("#search_No").val();		}		if ($("#search_FromDate").val() !== '') {			search += '&FromDate=' + $("#search_FromDate").val();		}		if ($("#search_ToDate").val() !== '') {			search += '&ToDate=' + $("#search_ToDate").val();		}		if ($("#search_Region").val() !== '') {			search += '&Region=' + $("#search_Region").val();		}		
		app.XHR().call({
			url: "orders/count/" + search,
			success: function (res) {
				$("#noOfOrders").html(res);
				if (res > 0) {
					$("#OrderHeader,#OrderFooter,#OrderContainer").show();
					app.grid.sort({ count: res, source: 'OrderHeader', pager: '.footer', target: 'OrderContainer', callback: app.order.load });
					app.grid.pager({ count: res, element: '.footer', target: 'OrderContainer', callback: app.order.load }).build();
				} else {
					$('#OrderContainer').html('');
					$("#OrderHeader,#OrderFooter,#OrderContainer").hide();
				}
			}
		});
	},
	load: function(){
		var target = $('#OrderContainer');
		var search = '?';
		if ($("#search_No").val() !== '') {			search += 'No=' + $("#search_No").val();		}		if ($("#search_FromDate").val() !== '') {			search += '&FromDate=' + $("#search_FromDate").val();		}		if ($("#search_ToDate").val() !== '') {			search += '&ToDate=' + $("#search_ToDate").val();		}		if ($("#search_Region").val() !== '') {			search += '&Region=' + $("#search_Region").val();		}		
		search += ('&skip={0}&limit={1}').format(target.data('skip'), target.data('limit'));
	
		if(target.data('sort-expression')){
			search += ('&s={0}&so={1}').format(target.data('sort-expression'), target.data('sort-order'));
		}
		
		app.XHR().call({
			url: "orders/" + search,
			success: function (res) {
				$('#OrderContainer').html('');
				//${( $data.index = $item.dataArrayIndex($item.data) ),''} Index: ${$data.index}
				$("#OrderGridTemplate").tmpl(res, {
					dataArrayIndex: function (item) {
						return $.inArray(item, res) + 1;
					}
				}).appendTo("#OrderContainer");
			}
		});
	},
	remove: function(id){
		var res = confirm('Are you sure?');
		if (res) {
			app.XHR().call({
				url: "orders/" + id,
				type: 'DELETE',
				success: function (res) {
					console.log('record deleted');
					app.order.count();
				}
			});
		}
	},
    cancel: function(){
        if(app.order.openInputPanelInModalDialog === true){
            $('#OrderInput .close').click();
        } else {
            $('#OrderRecordsFound').show();
            app.showHidePanel('OrderSearch','OrderInput');
        }
    },
	save: function(id){
        if(app.validate('OrderInput') == true){
            var data = $('#OrderInput').serializeObject();
            app.XHR().call({
                url: "orders/" + id,
                data: JSON.stringify(data),
                type: (id === '' ? 'POST' : 'PUT'),
                success: function (res) {
                    console.log('record saved');
                    if(app.order.openInputPanelInModalDialog === true){
                        $('#OrderInput .close').click();
                    } else {
                        $('#OrderRecordsFound').show();
                        app.showHidePanel('OrderSearch','OrderInput');
                    }
                    app.order.count();
                }
            });
        }
	},
	showInput: function(row){
		var data = { _id: '', Date: '', ExpectedBy: '', Region: '' };
		if (row !== undefined) {
			data = $(row).tmplItem().data;
		}
		$("#OrderInput").html('');
		$("#OrderTemplate").tmpl(data).appendTo("#OrderInput");
        if(app.order.openInputPanelInModalDialog === true){
            app.showModalDialog('OrderInput');
        } else {
            $('#OrderRecordsFound').hide();
            app.showHidePanel('OrderInput','OrderSearch');
        }
	},	regions: {},	loadRegions: function(next){		app.XHR().call({			url: "regions",			success: function (res) {				app.order.regions = res;				app.fillDropDown('search_Region', app.order.regions);				next();			}		});	}
};

(function () {
    app.order.loadRegions(function(){		app.order.count();
    	});
})();