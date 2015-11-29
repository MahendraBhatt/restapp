var XHR = function () {
	return (new function () {
		var url = 'http://localhost:3001/api/';
		var options = {
			url: '',
			data: '',
			type: 'GET',
			crossDomain: true,
			dataType: 'json',
			contentType: 'application/json',
			success: null,
			error: function (err) {
				console.log(err);
			}
		};
		this.call = function (_options) {
			$.extend(options, _options);
			options.url = url + options.url;
			$.ajax(options);
		}
	})
};