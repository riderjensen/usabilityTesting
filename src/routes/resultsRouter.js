// required files
const express = require('express');
const mongoUtil = require('../extraScripts/dbConnect');
const ObjectId = require('mongodb').ObjectID;


const resultsRouter = express.Router();

// anything sent to this router must contain the ID of the original test so that we can find it in mongo and retrieve the arrays that we need
function router() {
	resultsRouter.route('/')
		.get((req, res) => {
			// must have an ID attached to this page
			res.redirect('/auth/profile')
		});
	resultsRouter.route('/:id')
		.get((req, res) => {
			const reqID = req.params.id;
			let testArray, questionArray, webURL, createdDate;
			let ourUserInfoArray = [];
			let ourUserStatesArray = [];
			(async function mongo() {
				try {
					let db = mongoUtil.getDb();
					const col = db.collection('websites');

					const testFound = await col.findOne({
						"_id": ObjectId(reqID)
					});
					if (testFound == null || testFound.testArray == null) {
						res.render(404, {
							errMsg: 'Your results page cannot be found. This is usually a cookie error on your browser.'
						})
					} else {
						testArray = testFound.testArray;
						questionArray = testFound.questionArray;
						webURL = testFound.webURL;
						createdDate = testFound.createdAt;
					}
				} catch (err) {
					res.render('404', {
						errMsg: `Your results page cannot be found. Please refer to the error message:${err.stack}`
					})
				}
			}()).then(() => {
				(async function innerMongo() {
					for (let i = 0; i < testArray.length; i++) {
						try {
							let db = mongoUtil.getDb();
							const userTrackCol = db.collection('userTracking');
							const testFound = await userTrackCol.findOne({
								"_id": ObjectId(testArray[i])
							});
							ourUserInfoArray.push(testFound.userData);
							ourUserStatesArray.push(testFound.initInformation);
						} catch (err) {
							console.log(err);
						}
					}
				}()).then(() => {
					const newDate = new Date(createdDate);

					const deletionDate = new Date(newDate.setDate(newDate.getDate() + 30));
					const ourDeleted = deletionDate.getTime();

					const currentDate = new Date();
					const currentTime = currentDate.getTime();

					const testTimeRemaining = Math.ceil((ourDeleted - currentTime) / 86400000);
					const testTimePercentage = Math.ceil((testTimeRemaining / 30) * 100);

					res.render('resultsPage', {
						ourUserInfoArray,
						ourUserStatesArray,
						questionArray,
						webURL,
						createdDate,
						testTimeRemaining,
						testTimePercentage
					});
				});
			});

		});
	return resultsRouter;
}
module.exports = router;