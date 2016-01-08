//format function for string as in C#
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

//format Date to yyyymmdd format 
Date.prototype.mmddyyyy = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   return (mm[1]?mm:"0"+mm[0]) + '/' + (dd[1]?dd:"0"+dd[0]) + '/' +yyyy; // padding
};

//Serialize form
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

//Declaring namespace
var app = {
    currency: '$',
    currentModalDialogId: '',
    generateGUID: function() {
        var guid = function (len) {
            var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
            var str = '';
            for (var i = 0; i < len; i++) {
                str += chars.charAt(Math.floor(Math.random() * 62));
            }
            return str;
        }
        return function () { return guid(8) + '-' + guid(4) + '-' + guid(4) + '-' + guid(4) + '-' + guid(12) };
    },
    getRandomString: function(len) {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
        var str = '';
        for (var i = 0; i < len; i++) {
            str += chars.charAt(Math.floor(Math.random() * 62));
        }
        return str;
    },
    showModalDialog: function(dialog){
        var modalid = app.getRandomString(5);
        app.currentModalDialogId = modalid;
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
        app.attachCalendarEvent(dialog);
    },
    formatPrice: function(price) {
        if (price === null) { return ''; }
        return price.toFixed(2);
    },
    fillDropDown: function(id, source) {
        $('<option/>').val(0).html('Any').appendTo('#' + id);
        for (var x in source) {
            $('<option/>').val(source[x]._id).html(source[x].name).appendTo('#' + id);
        }
    },
    attachCalendarEvent: function(container){
        var containerId = container === undefined ? '' : '#'+container+' ';
        $(containerId + '.calendar').off('click').on('click', function(e){
            calendar.input = $(this);
            calendar.show();
            e.stopPropagation();
        });
    }
};