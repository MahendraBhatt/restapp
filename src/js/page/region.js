app.region = {
	count: function(){
		var search = '?';
		if ($("#search_name").val() !== '') {
			search += 'name=' + $("#search_name").val();
		}
		
		app.XHR().call({
			url: "regions/count/" + search,
			success: function (res) {
				$("#noOfRegions").html(res);
				if (res > 0) {
					$("#RegionHeader,#RegionFooter,#RegionContainer").show();
					app.grid.sort({ count: res, source: 'RegionHeader', pager: '.footer', target: 'RegionContainer', callback: app.region.load });
					app.grid.pager({ count: res, element: '.footer', target: 'RegionContainer', callback: app.region.load }).build();
				} else {
					$('#RegionContainer').html('');
					$("#RegionHeader,#RegionFooter,#RegionContainer").hide();
				}
			}
		});
	},
	load: function(){
		var target = $('#RegionContainer');
		var search = '?';
		if ($("#search_name").val() !== '') {
			search += 'name=' + $("#search_name").val();
		}
		
		search += ('&skip={0}&limit={1}').format(target.data('skip'), target.data('limit'));
	
		if(target.data('sort-expression')){
			search += ('&s={0}&so={1}').format(target.data('sort-expression'), target.data('sort-order'));
		}
		
		app.XHR().call({
			url: "regions/" + search,
			success: function (res) {
				$('#RegionContainer').html('');
				//${( $data.index = $item.dataArrayIndex($item.data) ),''} Index: ${$data.index}
				$("#RegionGridTemplate").tmpl(res, {
					dataArrayIndex: function (item) {
						return $.inArray(item, res) + 1;
					}
				}).appendTo("#RegionContainer");
			}
		});
	},
	remove: function(id){
		var res = confirm('Are you sure?');
		if (res) {
			app.XHR().call({
				url: "regions/" + id,
				type: 'DELETE',
				success: function (res) {
					console.log('record deleted');
					app.region.count();
				}
			});
		}
	},
	save: function(id){
		var data = $('#RegionInput').serializeObject();
		app.XHR().call({
			url: "regions/" + id,
			data: JSON.stringify(data),
			type: (id === '' ? 'POST' : 'PUT'),
			success: function (res) {
				console.log('record saved');
				$('#RegionInput .close').click();
				app.region.count();
			}
		});
		return false;
	},
	showInput: function(row){
		var data = {  };
		if (row !== undefined) {
			data = $(row).tmplItem().data;
		}
        console.log(data);
		$("#RegionInput").html('');
		$("#RegionTemplate").tmpl(data).appendTo("#RegionInput");
		app.showModalDialog('RegionInput');
	}
};

(function () {
	app.region.count();
})();