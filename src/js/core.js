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

//format Date to mmddyyyy format 
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
    $(this).find('input,select,textarea').each(function(){
        var val = this.value.trim();
        if($(this).hasClass('calendar') === true){
            var arr = val.split('/'); 
            val = new Date(arr[2],arr[0] - 1,arr[1]);
        }
        o[this.name] = val || '';
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
        d.width(width/1.2);
        d.css({top: height/2 - d.height()/2,left: width/2 - d.width()/2}).show();
        d.find('.close').click(function(){
            d.hide(); 
            $('#'+modalid).remove();
        });
        app.attachCalendarEvent(dialog);
    },
    showHidePanel: function(panel1, panel2){
        $('#'+panel1+' .close').hide();
        $('#'+panel1).show();
        $('#'+panel2).hide();
        app.attachCalendarEvent(panel1);
    },
    formatDate: function(val){
        if(val!==''){
            var d = new Date(val);
            return d.mmddyyyy();
        }
        return '';
    },
    formatPrice: function(price) {
        if (price === null) { return ''; }
        return price.toFixed(2);
    },
    fillDropDown: function(id, source, valueField) {
        valueField = valueField || '_id';
        $('<option/>').val(0).html('Any').appendTo('#' + id);
        for (var x in source) {
            $('<option/>').val(source[x][valueField]).html(source[x].name).appendTo('#' + id);
        }
    },
    attachCalendarEvent: function(container){
        var containerId = container === undefined ? '' : '#'+container+' ';
        $(containerId + '.calendar').off('click').on('click', function(e){
            calendar.input = $(this);
            calendar.show();
            e.stopPropagation();
        }).off('focusout').on('focusout', function(e){
            var val = $(this).val().trim();
            if(val !== ''){
                var dateRegEx = /^([0-1]?[0-9]{1})\/([0-3]?[0-9]{1})\/(\d{4})$/g;
                var match = dateRegEx.exec(val);
                var invalid = false;
                if(match === null){
                    invalid = true;
                } else {
                    var m = parseInt(match[1]), d = parseInt(match[2]), y = parseInt(match[3]);
                    if(y > calendar.maxYear || y < calendar.minYear){
                        invalid = true;
                    } else if(m == 2 && ((y % 4 == 0 && d > 29) || (y % 4 != 0 && d > 28))){
                        invalid = true;
                    } else if (m > 12 || d > 31) {
                        invalid = true;
                    } else {
                        var dt = new Date(val);
                        if(dt.toString() == 'Invalid Date'){
                            invalid = true;
                        }
                    }
                }
                if(invalid === true){
                    var that = $(this);
                    setTimeout(function(){
                        that.val('');
                        that.focus();    
                    }, 10);
                }
            }
        });
    },
    validate: function(container) {
        var mandatoryCheck = true, errMessage = '';
        $('#'+container+' .mandatory').each(function(){ 
            if($(this).val().trim() === ''){
                mandatoryCheck = false;
                errMessage += 'Please enter '+$(this).attr('data-label')+'\r';
            }
        });
        if(errMessage !== ''){
            alert(errMessage);
        }
        return mandatoryCheck;
    }
};