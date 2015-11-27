// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;
var Schema = mongoose.Schema;

var manufacturerSchema = new mongoose.Schema({
	name: String,
	city: String
})

//Region Schema
var regionSchema = new mongoose.Schema({
	name: String
})

//Product Schema
var productSchema = new mongoose.Schema({
	name: String,
	sku: String,
	price: Number,
	region : { type: Schema.Types.ObjectId, ref: 'Region' }
})

var regionModel = mongoose.model('Region', regionSchema); 
var productModel = mongoose.model('Product', productSchema);

//Return model
module.exports = {
		ProductRESTModel : restful.model('Products', productSchema),
		Product: productModel
};