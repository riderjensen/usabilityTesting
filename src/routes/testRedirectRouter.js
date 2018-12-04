// required files
const express = require('express');
const mongoUtil = require('../extraScripts/dbConnect');


const testRedirectRouter = express.Router();

function router() {
	testRedirectRouter.route('/:id')
		.get((req, res) => {
			let redirectID = req.params.id;
			(async function redirectUser() {
				try {
					let db = mongoUtil.getDb();
					const col = db.collection('websites');
					const theShortId = {
						shortURL: redirectID
					}
					let ourTest = await col.findOne(theShortId);
					res.redirect(`/site/${ourTest._id}`);
				} catch (err) {
					console.log(err);
				}
			}());
		});
	return testRedirectRouter;
}
module.exports = router;