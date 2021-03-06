// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;
var Schema = mongoose.Schema;

//order Schema
var orderSchema = new Schema({No: 'String',	Date: 'Date',	Value: 'String',	ExpectedBy: 'Date',	Region: { type: Schema.Types.ObjectId, ref: 'Region' }});

var orderModel = mongoose.model('Order', orderSchema);

//Return model
module.exports = {
		OrderRESTModel : restful.model('Order', orderSchema),
		Order: orderModel
};