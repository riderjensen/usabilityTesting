// required files
const express = require('express');
const mongoose = require('../models/model');
const webStorage = mongoose.model('webStorage');
const extraScripts = require('../extraScripts/scrapper');
const mongoUtil = require('../extraScripts/dbConnect');
const fs = require('fs');

const siteRouter = express.Router();

function router(nav) {
	siteRouter.route('/')
		.post((req, res, next) => {
			const {
				webURL,
				task0,
				task1,
				task2,
				task3,
				task4
			} = req.body;
			const questionArray = [task0, task1, task2, task3, task4];

			// this will need to be optimized and fixed
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

					const website = new webStorage({
						webURL,
						questionArray,
						addedOn
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
												date: Date.now()
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
							// we should display that they are not logged in and tell them about the benefits to making an account
							res.redirect("/site/testCreate" + querystring + "id=" + objectId + "&log=false");
						}
					});
				} catch (err) {
					console.log(err);
				}
			}());
		});
	siteRouter.route('/testCreate')
		.get((req, res) => {
			let URLPull = `http://localhost:3000/site/${req.query.id}`;
			let mainPage = `http://localhost:3000/results/${req.query.id}`;
			let ArrayPull = req.query.array;
			if (req.query.log) {
				// message to users that are not logged in
				let noLog = 'You are not currently logged in. Create a free account and add this test so that you can keep track of your results easier.'
				res.render('testCreate', {
					nav,
					URLPull,
					ArrayPull,
					mainPage,
					noLog

				});
			} else {
				res.render('testCreate', {
					nav,
					URLPull,
					ArrayPull,
					mainPage

				});
			}

		});
	siteRouter.route('/:id')
		.get((req, res) => {
			const reqID = req.params.id;
			res.render(`files/${reqID}`);
		});
	return siteRouter;
}
// exporting out the router
module.exports = router;