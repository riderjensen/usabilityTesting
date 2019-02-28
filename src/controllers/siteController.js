const webStorage = require('../models/websiteStorage.model');
const extraScripts = require('../extraScripts/scrapper');
const mongoUtil = require('../extraScripts/dbConnect');
const ObjectId = require('mongodb').ObjectID;
const fs = require('fs');
const shortid = require('shortid');

const usableURL = process.env.ADDR;

exports.createTest = (req, res) => {
	const {
		webURL,
		task0,
		task1,
		task2,
		task3,
		task4,
		testName
	} = req.body;
	let questionArray = [task0, task1, task2, task3, task4];

	while (questionArray[questionArray.length - 1] === undefined) {
		questionArray.pop();
	}
	const date = new Date();
	const addedOn = date.getDate();

	(async function createTest() {
		try {
			let objectId;
			let db = mongoUtil.getDb();
			const col = db.collection('websites');
			let shortURL = shortid.generate();
			const website = new webStorage({
				webURL,
				questionArray,
				addedOn,
				testName,
				shortURL
			});
			await col.insertOne(website, (err) => {
				objectId = website._id;
				const {
					requestURL
				} = extraScripts;
				requestURL(webURL, objectId);
				let querystring = '/?';
				for (let i = 0; i < questionArray.length; i++) {
					querystring += `array=${questionArray[i]}&`
				}
				querystring += `testName=${testName}&shortID=${shortURL}&`;
				if (req.user) {
					// add objectId into the user array
					let username = req.user.username;
					(async function addTestToUser() {
						try {

							let db = mongoUtil.getDb();
							const col = db.collection('users');

							const userFromDB = await col.findOne({
								username
							});
							const newVals = {
								$push: {
									projects: {
										objectId: objectId,
										date: Date.now(),
										testName
									}
								}
							};
							col.updateOne(userFromDB, newVals, (error) => {
								if (error) {
									throw error;
								}
							});
						} catch (err) {
							console.log(err);
						}
					}());
					res.redirect("/site/testCreate" + querystring + 'id=' + objectId);
				} else {
					res.redirect("/site/testCreate" + querystring + "id=" + objectId + "&log=false");
				}
			});
		} catch (err) {
			console.log(err);
		}
	}());
}

exports.fixRefreshIssueOnCreate = (req, res) => {
	let URLPull = `${usableURL}/t/${req.query.shortID}`;
	let mainPage = `${usableURL}/results/${req.query.id}`;
	let ArrayPull = req.query.array;
	let testName = req.query.testName;
	if (req.query.log) {
		// message to users that are not logged in
		let noLog = 'You are not currently logged in. Create a free account and add this test so that you can keep track of your results easier.'
		res.render('testCreate', {
			URLPull,
			ArrayPull,
			mainPage,
			noLog,
			testName,
			user: req.user
		});
	} else {
		res.render('testCreate', {
			URLPull,
			ArrayPull,
			mainPage,
			testName,
			user: req.user
		});
	}
}

exports.testCompleted = (req, res) => {
	let userId = req.query.id
	res.render('testCom', {
		userId,
		user: req.user
	})
}

exports.recordTheResults = (req, res) => {
	const {
		userResp0,
		userResp1,
		userResp2,
		userResp3,
		userResp4,
		testID
	} = req.body;
	let questionArray = [userResp0, userResp1, userResp2, userResp3, userResp4];

	while (questionArray[questionArray.length - 1] === undefined) {
		questionArray.pop();
	}
	(async function addFinalResults() {
		try {
			let db = mongoUtil.getDb();
			const col = db.collection('userTracking');
			col.updateOne({
				_id: ObjectId(testID)
			}, {
					$set: {
						finalAnswers: questionArray
					}
				})

		} catch (err) {
			console.log(err);
		}
	}());
	res.render('replayCom', {
		user: req.user
	});
}

exports.getIDPage = (req, res) => {
	let reqID = req.params.id;
	let ourReturn;
	if (reqID.length > 15) {
		(async function getTestArray() {
			try {
				let db = mongoUtil.getDb();
				const col = db.collection('websites');

				ourReturn = await col.findOne({
					"_id": ObjectId(reqID)
				});
			} catch (err) {
				console.log(err);
			}
		}());
		reqID = reqID + '.ejs'
	}
	let myAmountOfTimes = 0;
	let myTimeOut;

	myTimeOut = setInterval(function () {
		fs.access(`src/views/files/${reqID}`, fs.constants.F_OK, (err) => {
			if (err) {
				myAmountOfTimes += 1;
				if (myAmountOfTimes > 50) {
					res.render(`404`, {
						errMsg: `Your page could not be found. Either it has been deleted or there was an error in creating it.`
					});
					clearInterval(myTimeOut);
				}
			} else {
				// send front end the testing array questions
				if (ourReturn == undefined) {
					res.render(`files/${reqID}`);
					clearInterval(myTimeOut);
				} else {
					let questions = ourReturn.questionArray;
					res.render(`files/${reqID}`, {
						questions
					});
					clearInterval(myTimeOut);
				}

			}
		});
	}, 100);
}