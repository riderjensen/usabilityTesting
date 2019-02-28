const WebsiteModel = require('../models/websiteStorage.model');
const UserTrackingModel = require('../models/useTrack.model');

const usableURL = process.env.ADDR;

exports.checkForID = (req, res) => {
	// must have an ID attached to this page
	res.redirect('/auth/profile')
}

exports.displayTheResults = (req, res) => {
	const reqID = req.params.id;
	let testArray, questionArray, webURL, createdDate, testName;
	let ourUserInfoArray = [];
	let ourUserStatesArray = [];
	let ourUserAnswers = [];


	WebsiteModel.findById(reqID).then(testFound => {
		if (testFound == null || testFound.testArray == null) {
			res.render('404', {
				errMsg: 'Your results page cannot be found. This is usually a cookie error on your browser. Try deleteing all your cookies and returning to this page.',
				user: req.user
			});
		} else {
			testArray = testFound.testArray;
			questionArray = testFound.questionArray;
			webURL = testFound.webURL;
			createdDate = testFound.createdAt;
			testName = testFound.testName;
			url = testFound.shortURL;
		}
	}).then(testArray => {
		if (testArray == null) {
			throw 'Test array is null, we cant find the test'
		} else {
			for (let i = 0; i < testArray.length; i++) {

				UserTrackingModel.findById(testArray[i]).then(testFound => {
					if (testFound != null) {
						ourUserInfoArray.push(testFound.userData);
						ourUserStatesArray.push(testFound.initInformation);
						ourUserAnswers.push(testFound.finalAnswers)
					}
				}).then(() => {
					res.render('resultsPage', {
						ourUserInfoArray,
						ourUserStatesArray,
						questionArray,
						webURL,
						createdDate,
						testName,
						reqID,
						usableURL,
						url,
						ourUserAnswers,
						user: req.user
					});
				})

			}
		}
	}).catch(err => {
		res.render('404', {
			errMsg: `Your results page cannot be found. Please refer to the error message:${err.stack}`,
			user: req.user
		})
	})
}
