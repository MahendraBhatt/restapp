// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;
var Schema = mongoose.Schema;

//Product Schema
var productSchema = new Schema({
	name: 'String',
	sku: 'String',
	price: 'Number',
	region : { type: Schema.Types.ObjectId, ref: 'Region' }
})

var productModel = mongoose.model('Product', productSchema);

//Return model
module.exports = {
		ProductRESTModel : restful.model('Product', productSchema),
		Product: productModel
};