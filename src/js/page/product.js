var globals = {};
	globals.currency = "$";
	
function loadProductsCount(){
	var search = '?name=';
	if($("#search").val()!==''){
		search += $("#search_name").val();
	}
	search += '&region='+ $("#search_region").val();
	XHR().call({
		url: "products/count/"+search,
		success: function(res){
			$("#noOfProducts").html(res);
			if(res>0){
				$("#ProductHeader,#ProductFooter,#ProductContainer").show();
				gridPager({count:res, element: '.footer', target: loadProducts }).build();
			} else {
				$('#ProductContainer').html('');
				$("#ProductHeader,#ProductFooter,#ProductContainer").hide();
			}
		}
	});
}

function loadProducts(args){
	var search = '?name=';
	if($("#search").val()!==''){
		search += $("#search_name").val();
	}
	search += ('&region={0}&skip={1}&limit={2}').format($("#search_region").val(), args.skip, args.limit);
	XHR().call({
		url: "products/"+search,
		success: function(res){
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

function deleteProduct(id){
	var res = confirm('Are you sure?');
	if(res){
		XHR().call({
			url: "products/"+id,
			type: 'DELETE',
			success: function(res){
				console.log('record deleted');
				loadProductsCount();
			}
		});
	}
}

function showProductInput(row){
	var data = { name: '', price: 0, sku: '', region: '' };
	if(row!==undefined){
		data = $(row).tmplItem().data;
	}
	$("#ProductInput").html('');
	$("#ProductTemplate").tmpl(data).appendTo("#ProductInput");
	showModalDialog('ProductInput');
}

function saveProduct(id){
	var data = $('#ProductInput').serializeObject();
	XHR().call({
		url: "products/"+id,
		data: JSON.stringify(data),
		type: (id === '' ?  'POST' : 'PUT'),
		success: function(res){
			console.log('record saved');
			$('#ProductInput .close').click();
			loadProductsCount();
		}
	});
	return false;
}
	
function formatPrice(price) {
	if(price===null){return '';}
	return price.toFixed(2);
}

var regions = {};

function loadRegions(){
	XHR().call({
		url: "regions",
		success: function(res){
			regions = res;
			fillDropDown('search_region',regions);
			loadProductsCount();
		}
	});
}

function fillDropDown(id, source){
	$('<option/>').val(0).html('Any').appendTo('#'+id);
	for(var x in source){
		$('<option/>').val(source[x]._id).html(source[x].name).appendTo('#'+id);
	}	
}

(function(){
	loadRegions();
})();