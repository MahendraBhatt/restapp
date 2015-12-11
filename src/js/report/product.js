app.productreport = {
	load: function(){
		var target = $('#ProductContainer');
		var search = '?';
		if ($("#search").val() !== '') {
			search += 'name=';
		}
		search += ('&region={0}&skip={1}&limit={2}').format("0","0", "99999");
	
		////if(target.data('sort-expression')){
//			search += ('&s={0}&so={1}').format(target.data('sort-expression'), target.data('sort-order'));
//		}
	
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
	}
};

(function () {
	app.productreport.load();
})();