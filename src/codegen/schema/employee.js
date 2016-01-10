var schema = {
	namespace: 'app',
	name: 'Employee',
    openInputPanelInModalDialog: true,
	columns: [
		{ name: 'EmpNo', type: 'String', sortable: true, searchable: true, showInGrid: true }, 
		{ name: 'FirstName', type: 'String', sortable: false, searchable: true, showInGrid: true },
		{ name: 'MiddleInitial', type: 'String', sortable: false, searchable: false, showInGrid: true },
		{ name: 'LastName', type: 'String', sortable: false, searchable: false, showInGrid: true },
		{ name: 'HireDate', type: 'Date', sortable: false, searchable: true, showInGrid: true },
		{ name: 'JobTitle', type: 'String', sortable: false, searchable: false, showInGrid: true },
		{ name: 'Gender', type: 'String', sortable: true, searchable: true, showInGrid: true, referenceFrom: 'Gender', referenceFieldName: 'name' },
        { name: 'Region', type: 'Reference', sortable: true, searchable: true, showInGrid: true, referenceFrom: 'Region', referenceFieldName: 'name' },
		{ name: 'BirthDate', type: 'Date', sortable: false, searchable: true, showInGrid: true },
		{ name: 'Salary', type: 'Number', sortable: false, searchable: false, showInGrid: false }
	]
}
module.exports = schema;