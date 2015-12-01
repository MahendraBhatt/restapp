app.product = {
	count: function(){
		var search = '?';
		if ($("#search_name").val() !== '') {
			search += 'name=' + $("#search_name").val();
		}
		search += '&region=' + $("#search_region").val();
		app.XHR().call({
			url: "products/count/" + search,
			success: function (res) {
				$("#noOfProducts").html(res);
				if (res > 0) {
					$("#ProductHeader,#ProductFooter,#ProductContainer").show();
					app.grid.sort({ count: res, source: 'ProductHeader', pager: '.footer', target: 'ProductContainer', callback: app.product.load });
					app.grid.pager({ count: res, element: '.footer', target: 'ProductContainer', callback: app.product.load }).build();
				} else {
					$('#ProductContainer').html('');
					$("#ProductHeader,#ProductFooter,#ProductContainer").hide();
				}
			}
		});
	},
	load: function(){
		var target = $('#ProductContainer');
		var search = '?';
		if ($("#search").val() !== '') {
			search += 'name=' + $("#search_name").val();
		}
		search += ('&region={0}&skip={1}&limit={2}').format($("#search_region").val(), target.data('skip'), target.data('limit'));
	
		if(target.data('sort-expression')){
			search += ('&s={0}&so={1}').format(target.data('sort-expression'), target.data('sort-order'));
		}
	
		app.XHR().call({
			url: "products/" + search,
			success: function (res) {
				$('#ProductContainer').html('');
				//${( $data.index = $item.dataArrayIndex($item.data) ),''} Index: ${$data.index}
				$("#ProductGridTemplate").tmpl(res, {
					dataArrayIndex: function (item) {
						return $.inArray(item, res) + 1;
					}
				}).appendTo("#ProductContainer");
			}
		});
	},
	remove: function(id){
		var res = confirm('Are you sure?');
		if (res) {
			app.XHR().call({
				url: "products/" + id,
				type: 'DELETE',
				success: function (res) {
					console.log('record deleted');
					app.product.count();
				}
			});
		}
	},
	save: function(id){
		var data = $('#ProductInput').serializeObject();
		app.XHR().call({
			url: "products/" + id,
			data: JSON.stringify(data),
			type: (id === '' ? 'POST' : 'PUT'),
			success: function (res) {
				console.log('record saved');
				$('#ProductInput .close').click();
				app.product.count();
			}
		});
		return false;
	},
	showInput: function(row){
		var data = { name: '', price: 0, sku: '', region: '' };
		if (row !== undefined) {
			data = $(row).tmplItem().data;
		}
		$("#ProductInput").html('');
		$("#ProductTemplate").tmpl(data).appendTo("#ProductInput");
		app.showModalDialog('ProductInput');
	},
	regions: {},
	loadRegions: function(){
		app.XHR().call({
			url: "regions",
			success: function (res) {
				app.product.regions = res;
				app.fillDropDown('search_region', app.product.regions);
				app.product.count();
			}
		});
	}
};

(function () {
	app.product.loadRegions();
})();