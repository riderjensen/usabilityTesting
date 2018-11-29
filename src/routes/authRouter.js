// required files
const express = require('express');
const mongoose = require('../models/model');
const mongoUtil = require('../extraScripts/dbConnect');
const userStorage = mongoose.model('userStorage');
const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');
const ObjectId = require('mongodb').ObjectID;

const authRouter = express.Router();

function router(nav) {
	authRouter.route('/')
		.all((req, res, next) => {
			if (req.user) {
				next();
			} else {
				res.redirect('/');
			}
		})
		.post((req, res) => {
			const {
				testID,
				ourUsername
			} = req.body;
			(async function storeData() {
				try {
					let db = mongoUtil.getDb();
					const col = db.collection('websites');
					const testIDObj = ObjectId(testID);
					const idFromDB = await col.findOne({
						"_id": testIDObj
					});
					if (idFromDB) {
						const usercol = db.collection('users');
						const userFromDB = await usercol.findOne({
							"username": ourUsername
						});
						let strPrjArry = [];
						userFromDB.projects.forEach((element) => {
							strPrjArry.push(element.toString());
						})
						if (strPrjArry.includes(testID)) {
							// tell the user that they already have this test added
							let errMsg = 'You already added this test';
							console.log(errMsg);
						} else {
							const newVals = {
								$push: {
									projects: {
										objectId: testIDObj,
										date: Date.now()
									}
								}
							};
							await usercol.updateOne(userFromDB, newVals, (error) => {
								if (error) {
									throw error;
								} else {
									res.redirect('profile');
								}
							});
						}

					} else {
						// send an error to the user
						console.log('No test with this ID can be found.')
					}
				} catch (error) {
					// probably an incorrect testing id passed into mongo, send error to user
					console.log(error);
				}
			}());
		});
	authRouter.route('/signUp')
		.get((req, res) => {
			res.redirect('/auth/profile');
		})
		.post((req, res, next) => {
			const {
				username,
				password
			} = req.body;
			bcrypt.hash(password, null, null, (err, hash) => {
				(async function addUser() {
					try {

						let db = mongoUtil.getDb();
						const col = db.collection('users');

						// Creating variables to send into the database
						const date = new Date();
						const addedOn = date.getDate();
						const emptyArray = []; // this is to initialize an array of projects that is not filled yet
						const password = hash;


						const userFromDB = await col.findOne({
							username
						});
						if (userFromDB) {
							console.log('Duplicate User');
						} else {
							const user = new userStorage({
								username,
								password,
								emptyArray,
								addedOn
							});
							await col.insertOne(user);
							next();
						}
					} catch (error) {
						console.log(error);
					}
				}());
			});
		}, passport.authenticate('local', {
			successRedirect: '/auth/profile',
			failureRedirect: '/'
		}));
	authRouter.route('/signIn')
		.post(passport.authenticate('local', {
			successRedirect: '/auth/profile',
			failureRedirect: '/',
			failureFlash: 'Incorrect username or password'
		}))
		.get((req, res) => {
			res.redirect('/auth/profile');
		});
	authRouter.route('/profile')
		.all((req, res, next) => {
			if (req.user) {
				next();
			} else {
				res.redirect('/');
			}
		})
		.get((req, res) => {
			let userData = req.user;
			let username = req.user.username;
			(async function getData() {
				try {

					let db = mongoUtil.getDb();
					const col = db.collection('users');
					const userFromDB = await col.findOne({
						username
					});
					let projects = userFromDB.projects
					res.render('profile', {
						userData,
						projects,
						nav
					});
				} catch (error) {
					console.log(error);
				}
			}());

		});
	authRouter.route('/delete')
		.all((req, res, next) => {
			if (req.user) {
				next();
			} else {
				res.redirect('/');
			}
		})
		.post((req, res) => {
			// need to retrieve user data and send to screen
			const testToDelete = req.body.deleteTestID;
			const d = new Date('1/1/2000');
			(async function getData() {
				try {
					let db = mongoUtil.getDb();
					const col = db.collection('websites');
					await col.updateOne({
						'_id': ObjectId(testToDelete)
					}, {
						$set: {
							createdAt: d
						}
					});
					// delete the test since the time is set to be older than the 30 days
					const deleteAtMidnight = require('../extraScripts/deleteOldTests');
					deleteAtMidnight.midNight();

					res.redirect('/auth/profile');
				} catch (error) {
					console.log(error);
				}
			}());

		});
	authRouter.route('/copy')
		.all((req, res, next) => {
			if (req.user) {
				next();
			} else {
				res.redirect('/');
			}
		})
		.post((req, res) => {
			const copyID = req.body.copyTestID;
			const copyName = req.body.copyTestName;
			(async function copyData() {
				try {
					let db = mongoUtil.getDb();
					const col = db.collection('websites');
					let newDoc = await col.findOne({
						'_id': ObjectId(copyID)
					});
					newDoc.testName = copyName;
					res.render('copy', {
						newDoc
					});
				} catch (error) {
					console.log(error);
				}
			}());

		});
	return authRouter;
}
// exporting out the router
module.exports = router;