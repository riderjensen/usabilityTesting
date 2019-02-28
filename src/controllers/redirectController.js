const WebsiteModel = require('../models/websiteStorage.model');

exports.redirectUsers = (req, res) => {
	let redirectID = req.params.id;
	const theShortId = {
		shortURL: redirectID
	}
	WebsiteModel.findOne(theShortId)
		.then(ourTest => res.redirect(`/site/${ourTest._id}`))
		.catch(err => console.log(err));
}