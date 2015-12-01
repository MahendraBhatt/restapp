// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

//Schema
var regionSchema = new mongoose.Schema({
	name: String
})

//Return model
module.exports = restful.model('Region', regionSchema);