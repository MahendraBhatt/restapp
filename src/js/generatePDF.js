// var PDFDocument, doc;
// 
// var fs = require('fs');
// 
// PDFDocument = require('pdfkit');
// 
// doc = new PDFDocument;
// 
// doc.pipe(fs.createWriteStream('../pdf/output.pdf'));
// 
// doc.font('Helvetica').fontSize(25).text('This is normal Helvetica', 100, 100);
// 
// doc.font('Helvetica-Bold').fontSize(25).text('This is bold Helvetica!', 100, 130);
// 
// doc.addPage().fontSize(25).text('Here is some vector graphics...', 100, 100);
// 
// doc.save().moveTo(100, 150).lineTo(100, 250).lineTo(200, 250).fill("#FF3300");
// 
// doc.scale(0.6).translate(470, -380).path('M 250,75 L 323,301 131,161 369,161 177,301 z').fill('red', 'even-odd').restore();
// 
// doc.addPage().fillColor("blue").text('Here is a link!', 100, 100).underline(100, 100, 160, 27, {
//   color: "#0000FF"
// }).link(100, 100, 160, 27, 'http://google.com/');
// 
// doc.end();
// 
// var PDFKit = require('pdfkitjs');
// console.log(PDFKit);
// var pdf = new PDFKit('html','<b>Hello World</b><br/>What is universe?');
// 
// pdf.toFile('../pdf/output1.pdf', function(err, file){
//    console.log('File ' + file + ' written');
// });

var exec = require('child_process').execFile;

var fun =function(){
   console.log("fun() start");
   exec('wkhtmltopdf', 'new.html output1.pdf', function(err, data) {  
        console.log(err)
        console.log(data.toString());                       
    });  
}
fun();