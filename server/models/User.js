var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	userId: {
		type: String,
		unique: true,
		required: true,
		dropDups: true
	},
	avatar_url: {
		type: String,
		required: true
	}

});

module.exports = mongoose.model('User', UserSchema);
