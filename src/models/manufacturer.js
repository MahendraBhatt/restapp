// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

//Schema
var manufacturerSchema = new mongoose.Schema({
	name: String,
	city: String
})

//Return model
module.exports = restful.model('Manufacturers', manufacturerSchema);