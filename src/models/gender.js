// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;
var Schema = mongoose.Schema;

//gender Schema
var genderSchema = new Schema({
	"name": "String"
})

var genderModel = mongoose.model('Gender', genderSchema);

//Return model
module.exports = {
		GenderRESTModel : restful.model('Gender', genderSchema),
		Gender: genderModel
};