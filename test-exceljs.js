var Excel = require("exceljs");
var workbook = new Excel.Workbook();
workbook.creator = "Me";
workbook.lastModifiedBy = "Her";
workbook.created = new Date(1985, 8, 30);
workbook.modified = new Date();
var sheet = workbook.addWorksheet("Halo");

// Add column headers and define column keys and widths 
// Note: these column structures are a workbook-building convenience only, 
// apart from the column width, they will not be fully persisted. 
sheet.columns = [
    { header: "Id", key: "id", width: 10 },
    { header: "Name", key: "name", width: 32 },
    { header: "D.O.B.", key: "DOB", width: 20 }
];
 
sheet.addRow({id: 1, name: "John Doe", dob: '1970-1-1'});
sheet.addRow({id: 2, name: "Jane Doe", dob: '1970-1-7'});
 
workbook.xlsx.writeFile('test.xlsx')
    .then(function() {
        // done 
		console.log('done');
    });
 