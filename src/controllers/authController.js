const UserModel = require('../models/userStorage.model');
const WebsiteModel = require('../models/websiteStorage.model');
const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');

const usableURL = process.env.ADDR;

exports.checkUserLog = (req, res, next) => {
	if (req.user) {
		next();
	} else {
		res.redirect('/');
	}
}

exports.sendRedirect = (req, res) => {
	console.log('here')
	res.redirect('/auth/profile');
}

exports.postSignUp = (req, res, next) => {
	const {
		username,
		password
	} = req.body;
	bcrypt.hash(password, null, null, (err, hash) => {
		// Creating variables to send into the database
		const date = new Date();
		const addedOn = date.getDate();
		const emptyArray = []; // this is to initialize an array of projects that is not filled yet
		const password = hash;

		UserModel.findOne({ username })
			.then(resp => {
				if (resp) {
					res.redirect('/?duplicateUser=true')
				} else {
					const user = new UserModel({
						username,
						password,
						emptyArray,
						addedOn
					});
					user.save().then(_ => {
						next();

					})
				}
			}).catch(error => console.log(error))
	});
}, passport.authenticate('local', {
	successRedirect: '/auth/profile',
	failureRedirect: '/'
})

exports.postSignIn = passport.authenticate('local', {
	successRedirect: '/auth/profile',
	failureRedirect: '/',
	failureFlash: 'Incorrect username or password'
})

exports.loadProfile = (req, res) => {
	let userData = req.user;
	let username = req.user.username;

	UserModel.findOne({
		username
	}).then(user => {
		let projects = user.projects
		res.render('profile', {
			userData,
			projects,
			usableURL,
			user: req.user
		});
	}).catch(err => console.log(err))

}

exports.deleteTest = (req, res) => {
	// need to retrieve user data and send to screen
	const testToDelete = req.body.deleteTestID;
	const d = new Date('1/1/2000');
	WebsiteModel.findByIdAndUpdate(testToDelete, {
		$set: {
			createdAt: d
		}
	}).then(_ => {
		// delete the test since the time is set to be older than the 30 days

		const deleteAtMidnight = require('../extraScripts/deleteOldTests');
		deleteAtMidnight.midNight();

		res.redirect('/auth/profile');
	}).catch(err => console.log(err))


}

exports.copyTest = (req, res) => {
	const copyID = req.body.copyTestID;
	const copyName = req.body.copyTestName;

	WebsiteModel.findById(copyID).then(newDoc => {
		newDoc.testName = copyName;
		res.render('copy', {
			newDoc
		});
	}).catch(err => console.log(err))
}