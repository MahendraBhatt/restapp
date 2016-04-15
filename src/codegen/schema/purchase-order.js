var schema = {
	namespace: 'app',
	name: 'PO',
    openInputPanelInModalDialog: false,
	columns: [
		{ name: 'NO', type: 'String', label: 'PO #', mandatory: true, sortable: true, searchable: true, showInGrid: true, maxLength: 10 }, 
		{ name: 'DateRequired', type: 'Date', label: 'Date Required', sortable: true, searchable: true, showInGrid: true },
		{ name: 'CreatedBy', type: 'String', label: 'Creator', sortable: false, searchable: false, showInGrid: true },
        { name: 'Cost', type: 'Number', label: 'Cost', sortable: true, searchable: false, showInGrid: true }
	]
}
module.exports = schema;