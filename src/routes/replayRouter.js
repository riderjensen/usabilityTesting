// required files
const express = require('express');
const mongoUtil = require('../extraScripts/dbConnect');
const ObjectId = require('mongodb').ObjectID;


const replayRouter = express.Router();

// anything sent to this router must contain the ID of the original test so that we can find it in mongo and retrieve the arrays that we need
function router() {
	replayRouter.route('/')
		.get((req, res) => {
			res.redirect('/auth/profile')
		});
	replayRouter.route('/:id')
		.get((req, res) => {
			const reqID = req.params.id;
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
							const userArray = findTracking.recMoves;
							const initInfo = findTracking.initInformation;
							console.log(reqID)
							res.render(`files/${ourUpperTestId}`, {
								initInfo,
								reqID
							});
						} catch (err) {
							console.log(err);
						}

					}());
				} catch (err) {
					console.log(err.stack);
				}
			}());
		});
	return replayRouter;
}
// exporting out the router
module.exports = router;