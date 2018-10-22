// required files
const express = require('express');
const mongoUtil = require('../extraScripts/dbConnect');
const ObjectId = require('mongodb').ObjectID;


const resultsRouter = express.Router();

// anything sent to this router must contain the ID of the original test so that we can find it in mongo and retrieve the arrays that we need
function router() {
	resultsRouter.route('/')
		.get((req, res) => {
			// must have an ID attached to this page
			res.redirect('/auth/profile')
		});
	resultsRouter.route('/:id')
		.get((req, res) => {
			const reqID = req.params.id;
			(async function mongo() {
				try {
					let db = mongoUtil.getDb();
					const col = db.collection('websites');

					const testFound = await col.findOne({
						"_id": ObjectId(reqID)
					});
					if (testFound.testArray == null) {
						console.log('Probably a cookie issue with someone having an old cookie when testing');
					} else {
						const testArray = testFound.testArray;
						const questionArray = testFound.questionArray;
						const webURL = testFound.webURL;
						const createdDate = testFound.createdAt;
						res.render('resultsPage', {
							testArray,
							questionArray,
							webURL,
							createdDate
						});
					}
				} catch (err) {
					console.log(err.stack);
				}
			}());

		});
	return resultsRouter;
}
// exporting out the router
module.exports = router;