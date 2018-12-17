// required files
const express = require('express');
const mongoose = require('../models/model');
const mongoUtil = require('../extraScripts/dbConnect');
const userStorage = mongoose.model('userStorage');
const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');
const ObjectId = require('mongodb').ObjectID;

const usableURL = process.env.ADDR;

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
							res.redirect('/?duplicateUser=true')
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
						nav,
						usableURL
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