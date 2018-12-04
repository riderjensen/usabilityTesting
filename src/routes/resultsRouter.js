// required files
const express = require('express');
const mongoUtil = require('../extraScripts/dbConnect');
const ObjectId = require('mongodb').ObjectID;

const usableURL = 'http://localhost:3000';

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
			let testArray, questionArray, webURL, createdDate, testName;
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
						res.render('404', {
							errMsg: 'Your results page cannot be found. This is usually a cookie error on your browser. Try deleteing all your cookies and returning to this page.'
						});
					} else {
						testArray = testFound.testArray;
						questionArray = testFound.questionArray;
						webURL = testFound.webURL;
						createdDate = testFound.createdAt;
						testName = testFound.testName;
					}
				} catch (err) {
					res.render('404', {
						errMsg: `Your results page cannot be found. Please refer to the error message:${err.stack}`
					})
				}
			}()).then(() => {
				(async function innerMongo() {
					try {
						if (testArray == null) {
							throw 'Test array is null, we cant find the test'
						} else {
							for (let i = 0; i < testArray.length; i++) {
								let db = mongoUtil.getDb();
								const userTrackCol = db.collection('userTracking');
								const testFound = await userTrackCol.findOne({
									"_id": ObjectId(testArray[i])
								});
								ourUserInfoArray.push(testFound.userData);
								ourUserStatesArray.push(testFound.initInformation);
							}
						}
					} catch (err) {
						res.render('404', {
							errMsg: `We experienced and error within our code. Please refer to the error message:${err}`
						})
					}

				}()).then(() => {
					res.render('resultsPage', {
						ourUserInfoArray,
						ourUserStatesArray,
						questionArray,
						webURL,
						createdDate,
						testName,
						reqID,
						usableURL
					});
				});
			});
		});
	return resultsRouter;
}
module.exports = router;