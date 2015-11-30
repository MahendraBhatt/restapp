String.prototype.format = function () {
	var rg = /({\d+})/g;
	var result = this.match(rg);
	var str = this;
	for (var x in result) {
		var desiredArgument = result[x].trim().replace('{', '').replace('}', '');
		if (arguments[desiredArgument] !== undefined) {
			str = str.replace(result[x], arguments[desiredArgument]);
		}
	}
	return str;
};

// e.g. '{0}, how are you {1}?'.format('test 1','test 2')

// new file
function generateGUID() {
    var guid = function (len) {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
        var str = '';
        for (var i = 0; i < len; i++) {
            str += chars.charAt(Math.floor(Math.random() * 62));
        }
        return str;
    }
    return function () { return guid(8) + '-' + guid(4) + '-' + guid(4) + '-' + guid(4) + '-' + guid(12) };
}

 function getRandomString(len) {
	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
	var str = '';
	for (var i = 0; i < len; i++) {
		str += chars.charAt(Math.floor(Math.random() * 62));
	}
	return str;
}

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

function showModalDialog(dialog){
    var modalid = getRandomString(5);
    var width = $(window).width();
    var height = $(window).height();
    $(document.body).append('<div id="'+modalid+'" class="modal-background" style="width:'+width+'px;height:'+height+'px;"></div>');
    var d = $('#'+dialog);
    d.addClass('modal-dialog');
    d.css({top: height/2 - d.height()/2,left: width/2 - d.width()/2}).show();
    d.find('.close').click(function(){
       d.hide(); 
       $('#'+modalid).remove();
    });
}

function buildGridSort(headerId){
    var collection = $('#'+headerId+' a[data-sort-expression]');
    collection.click(function(){
        var thisObject = $(this);
        var sortOrder = thisObject.attr('data-sort-order');
        collection.removeClass('asc desc');
        collection.attr('data-sort-order','');
        thisObject.addClass(sortOrder === 'asc' ? 'desc' : 'asc');
        thisObject.attr('data-sort-order', sortOrder === 'asc' ? 'desc' : 'asc');
    });
}