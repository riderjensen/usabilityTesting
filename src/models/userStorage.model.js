const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// userStorage.projects id coresponds to the first page created from the test
// each userStorage.projects need to be an object that contains the projectID and the questions
const userStorage = new Schema({
	username: String,
	password: String,
	// array of project objects
	projects: Array,
	createdAt: {
		type: Date,
		default: Date.now
	}
});
module.exports = mongoose.model("userStorage", userStorage);