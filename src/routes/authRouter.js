// required files
const express = require('express');
const mongoose = require('../models/model');
const mongoUtil = require('../extraScripts/dbConnect');
const userStorage = mongoose.model('userStorage');
const passport = require('passport');
const bcrypt = require('bcrypt');
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
			// getting undefined respondes on req.body but not 
			const {
				testID,
				ourUsername
			} = req.body;
			(async function storeData() {
				try {
					let db = mongoUtil.getDb();
					const col = db.collection('websites');

					const idFromDB = await col.findOne({
						"_id": ObjectId(testID)
					});
					if (idFromDB) {
						const usercol = db.collection('users');

						const userFromDB = await usercol.findOne({
							"username": ourUsername
						});

						if (userFromDB.projects.includes(testID)) {
							// tell the user that they already have this test added
							console.log('You already added this test');
						} else {
							const newVals = {
								$push: {
									projects: testID
								}
							};
							await usercol.updateOne(userFromDB, newVals, (error) => {
								if (error) {
									throw error;
								} else {
									res.redirect('/profile');
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
		.post((req, res) => {
			const {
				username,
				password
			} = req.body;
			bcrypt.hash(password, 10, (err, hash) => {
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
							res.redirect('/auth/profile');
						}
					} catch (error) {
						console.log(error);
					}
				}());
			});
		});
	authRouter.route('/signIn')
		.post(passport.authenticate('local', {
			successRedirect: '/auth/profile',
			failureRedirect: '/'
		}))
		.get((req, res) => {
			res.redirect('auth/profile');
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
			// need to retrieve user data and send to screen
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
	return authRouter;
}
// exporting out the router
module.exports = router;