const mongoose = require('mongoose');
const {
	Schema
} = mongoose;

// associated id connects to projects in userStorage.projects array

const useTrack = new Schema({
	initInformation: Object,
	// array of objects that we continuously push on to
	recMoves: Array,
	pageName: String,
	userData: {
		type: Object,
		default: {
			name: 'None given',
			age: 'None given',
			race: 'None given',
			initID: -1
		}
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	finalAnswers: Array
});
module.exports = mongoose.model("userTracking", useTrack);