// required files
const express = require('express');
const mongoUtil = require('../extraScripts/dbConnect');


const replayRouter = express.Router();

// anything sent to this router must contain the ID of the original test so that we can find it in mongo and retrieve the arrays that we need
function router(nav) {
	replayRouter.route('/')
		.get((req, res) => {
			res.redirect('/auth/profile')
		});
	replayRouter.route('/:id')
		.get((req, res) => {
			// grab the id
			const reqID = req.params.id;
			(async function mongo() {
				let client;
				try {
					let db = mongoUtil.getDb();
					const col = db.collection('websites');

					await col.findOne({
						reqID
					});

					// we have found the specific test, now we need to pull the data related to the tests and send it to replay.ejs (UNFINSHED, Waiting on back end data structures)
					res.render('replay', {
						nav,
						// here we will pass URL
						// here we will pass the array
						// etc etc
					});
				} catch (err) {
					console.log(err.stack);
				}
			}());

		});
	return replayRouter;
}
// exporting out the router
module.exports = router;