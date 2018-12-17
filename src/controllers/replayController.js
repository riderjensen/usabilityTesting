const mongoUtil = require('../extraScripts/dbConnect');
const ObjectId = require('mongodb').ObjectID;

exports.sendHome = (req, res) => {
	res.redirect('/auth/profile')
}

exports.replayComplete = (req, res) => {
	res.render('replayCom')
}

exports.firstPageOfTest = (req, res) => {
	const reqID = req.params.id;
	if (reqID == -1) {
		res.send(`It seems that the there is an issue with this test ID; The replay was not saved and an ID was not assigned.`);
	} else {
		(async function mongo() {
			try {
				let db = mongoUtil.getDb();
				let webCol = db.collection('websites');
				const websiteFind = await webCol.findOne({
					"testArray": ObjectId(reqID)
				})
				const ourWeb = websiteFind;
				(async function anotherMongo() {
					try {
						const ourUpperTestId = ObjectId(ourWeb._id);
						let col = db.collection('userTracking');
						const findTracking = await col.findOne({
							"_id": ObjectId(reqID)
						});
						let firstPageID = ourWeb._id;
						const initInfo = findTracking.initInformation;
						res.render(`files/${ourUpperTestId}`, {
							initInfo,
							reqID,
							firstPageID
						});
					} catch (err) {
						console.log(err);
					}

				}());
			} catch (err) {
				console.log(err.stack);
			}
		}());
	}
}

exports.replayPage = (req, res) => {
	const reqID = req.params.id;
	if (reqID.length > 23) {
		res.render(`files/${reqID}`);
	} else {
		res.render(`files/${reqID}`)
	};

}