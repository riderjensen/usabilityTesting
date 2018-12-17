const extraScripts = require('../extraScripts/scrapper');
const shortid = require('shortid');

exports.reqAPage = (req, res) => {
	let webURL = req.query.url;
	webURL = decodeURIComponent(webURL);
	const newID = shortid.generate();
	const {
		requestURL
	} = extraScripts;
	requestURL(webURL, newID);
	res.redirect(`/site/${newID}.ejs`);
}