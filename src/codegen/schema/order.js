var schema = {
	namespace: 'app',
	name: 'Order',
	openAddEditInModal: false,
	columns: [
		{ name: 'No', type: 'String', sortable: true, searchable: true, showInGrid: true }, 
		{ name: 'Date', type: 'Date', sortable: true, searchable: true, showInGrid: true },
		{ name: 'Value', type: 'String', sortable: false, searchable: false, showInGrid: true }
	]
}
module.exports = schema;