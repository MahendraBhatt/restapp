var schema = {
	namespace: 'app',
	name: 'Order',
	openInputPanelInModalDialog: true,
	columns: [
		{ name: 'No', type: 'String', sortable: true, searchable: true, showInGrid: true }, 
		{ name: 'Date', type: 'Date', sortable: true, searchable: true, showInGrid: true },
		{ name: 'Value', type: 'String', sortable: true, searchable: false, showInGrid: true }
	]
}
module.exports = schema;