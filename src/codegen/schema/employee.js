var schema = {
	namespace: 'app',
	name: 'Employee',
    openInputPanelInModalDialog: false,
	columns: [
		{ name: 'EmpNo', type: 'String', label: 'Employee #', mandatory: true, sortable: true, searchable: true, showInGrid: true, maxLength: 10 }, 
		{ name: 'FirstName', type: 'String', label: 'First Name', sortable: false, searchable: true, showInGrid: true, maxLength: 20 },
		{ name: 'MiddleInitial', type: 'String', label: 'Middle Initial', sortable: false, searchable: false, showInGrid: true },
		{ name: 'LastName', type: 'String', label: 'Last Name', sortable: false, searchable: false, showInGrid: true },
		{ name: 'HireDate', type: 'Date', label: 'Hire Date', mandatory: true, sortable: false, searchable: true, showInGrid: true },
		{ name: 'JobTitle', type: 'String', label: 'Job Title', sortable: false, searchable: false, showInGrid: true },
		{ name: 'Gender', type: 'String', sortable: true, searchable: true, showInGrid: true, referenceFrom: 'Gender', referenceFieldName: 'name' },
        { name: 'Region', type: 'Reference', sortable: true, searchable: true, showInGrid: true, referenceFrom: 'Region', referenceFieldName: 'name' },
		{ name: 'BirthDate', type: 'Date', label: 'Birth Date', sortable: false, searchable: true, showInGrid: true },
		{ name: 'Salary', type: 'Number', sortable: false, searchable: false, showInGrid: false }
	]
}
module.exports = schema;