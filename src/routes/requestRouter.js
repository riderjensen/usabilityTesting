// required files
const express = require('express');
const extraScripts = require('../extraScripts/extra');
const shortid = require('shortid');

const reqRouter = express.Router();

function router(nav) {
	reqRouter.route('/')
		.get((req, res) => {
			let webURL = req.query.url;
			webURL = decodeURIComponent(webURL);
			const {
				requestURL
			} = extraScripts;
			let newID = shortid.generate();
			requestURL(webURL, newID);
			res.redirect(`/site/${newID}.ejs`)
		});
	return reqRouter;
}
// exporting out the router
module.exports = router;