// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;
var Schema = mongoose.Schema;

var manufacturerSchema = new mongoose.Schema({
	name: String,
	city: String
})
//Schema
var productSchema = new mongoose.Schema({
	name: String,
	sku: String,
	price: Number,
	manufacturer: manufacturerSchema,
	region : { type: Schema.Types.ObjectId, ref: 'Regions' }
})

//Return model
module.exports = restful.model('Products', productSchema);