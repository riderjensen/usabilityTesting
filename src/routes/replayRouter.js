// required files
const express = require('express');
const mongoUtil = require('../extraScripts/dbConnect');


const replayRouter = express.Router();

// anything sent to this router must contain the ID of the original test so that we can find it in mongo and retrieve the arrays that we need
function router() {
	replayRouter.route('/')
		.get((req, res) => {
			res.redirect('/auth/profile')
		});
	replayRouter.route('/:id')
		.get((req, res) => {
			// grab the id
			const reqID = req.params.id;
			(async function mongo() {
				try {
					let db = mongoUtil.getDb();
					const col = db.collection('userTracking');

					const testFound = await col.findOne({
						associatedID: reqID
					});

					const userArray = testFound.recMoves;
					const initInfo = testFound.initInformation;
					res.render('replay', {
						userArray,
						initInfo
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