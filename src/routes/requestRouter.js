// required files
const express = require('express');
const { MongoClient } = require('mongodb');
const mongoose = require('../models/model');
const webStorage = mongoose.model('webStorage');
const extraScripts = require('../extraScripts/extra');

const reqRouter = express.Router();

function router(nav) {
	reqRouter.route('/')
		.get((req, res) => {
			let webURL  = req.query.url;
			webURL = decodeURIComponent(webURL);
			console.log(webURL);
			// webURL is working, need to feed this back into the scrapper function and get res.render the correct page
		});
    return reqRouter;
}
// exporting out the router
module.exports = router;
