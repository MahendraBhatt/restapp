var schema = {
	namespace: 'app',
	name: 'Order',
	openInputPanelInModalDialog: true,
	columns: [
		{ name: 'No', type: 'String', sortable: true, searchable: true, showInGrid: true }, 
		{ name: 'Date', type: 'Date', sortable: true, searchable: true, showInGrid: true },
		{ name: 'Value', type: 'String', sortable: true, searchable: false, showInGrid: true },
        { name: 'ExpectedBy', type: 'Date', sortable: true, searchable: false, showInGrid: true },
        { name: 'Region', type: 'Reference', sortable: true, searchable: true, showInGrid: true, referenceFrom: 'Region', referenceFieldName: 'name'}
	]
}
module.exports = schema;