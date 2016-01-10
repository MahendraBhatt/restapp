// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;
var Schema = mongoose.Schema;

//region Schema
var regionSchema = new Schema({
	"name": "String"
})

var regionModel = mongoose.model('Region', regionSchema);

//Return model
module.exports = {
		RegionRESTModel : restful.model('Region', regionSchema),
		Region: regionModel
};