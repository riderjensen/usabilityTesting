// required files
const express = require('express');
const extraScripts = require('../extraScripts/scrapper');
const shortid = require('shortid');

const reqRouter = express.Router();

function router() {
	reqRouter.route('/')
		.get((req, res) => {
			let webURL = req.query.url;
			webURL = decodeURIComponent(webURL);
			const newID = shortid.generate();
			const {
				requestURL
			} = extraScripts;
			requestURL(webURL, newID);
			res.redirect(`/site/${newID}.ejs`);
		});
	return reqRouter;
}
// exporting out the router
module.exports = router;