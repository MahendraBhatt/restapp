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
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var str = '';
        for (var i = 0; i < len; i++) {
            str += chars.charAt(Math.floor(Math.random() * 36));
        }
        return str;
    }
    return function () { return guid(8) + '-' + guid(4) + '-' + guid(4) + '-' + guid(4) + '-' + guid(12) };
}

