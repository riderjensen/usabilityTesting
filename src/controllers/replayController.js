const ObjectId = require('mongodb').ObjectID;
const WebsiteModel = require('../models/websiteStorage.model');
const UserTrackingModel = require('../models/useTrack.model');

exports.sendHome = (req, res) => {
	res.redirect('/auth/profile')
}

exports.replayComplete = (req, res) => {
	res.render('replayCom', {
		user: req.user
	})
}

exports.firstPageOfTest = (req, res) => {
	const reqID = req.params.id;
	if (reqID == -1) {
		res.send(`It seems that the there is an issue with this test ID; The replay was not saved and an ID was not assigned.`);
	} else {
		WebsiteModel.findOne({
			"testArray": ObjectId(reqID)
		}).then(ourWeb => {
			UserTrackingModel.findById(reqID)
				.then(findTracking => {
					const firstPageID = ourWeb._id;
					const initInfo = findTracking.initInformation;
					res.render(`files/${firstPageID}`, {
						initInfo,
						reqID,
						firstPageID
					});
				})
		}).catch(err => console.log(err))
	}
}

exports.replayPage = (req, res) => {
	const reqID = req.params.id;
	console.log(reqID)
	if (reqID.length > 23) {
		res.render(`files/${reqID}`);
	} else {
		res.render(`files/${reqID}`)
	};

}