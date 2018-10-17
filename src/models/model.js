const mongoose = require('mongoose');
const {
	Schema
} = mongoose;

const websiteStorage = new Schema({
	webURL: String,
	testArray: Array,
	createdAt: {
		type: Date,
		default: Date.now
	},
	questionArray: {
		// question that needs to be answered
		question: String,
		// shortAnswer, multipleChoice, select, task completion with a true/false answer
		type: String,
		answers: [{
			answer: String,
			correct: Boolean
		}, {
			answer: String,
			correct: Boolean
		}, {
			answer: String,
			correct: Boolean
		}, {
			answer: String,
			correct: Boolean
		}]
	}
});
module.exports = mongoose.model("webStorage", websiteStorage);

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

// associated id connects to projects in userStorage.projects array
const userTracking = new Schema({
	associatedID: String,
	// array of objects that we continuously push on to
	recMoves: Array
});
module.exports = mongoose.model("userTracking", userTracking);
