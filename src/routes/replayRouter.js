// required files
const express = require('express');
const mongoUtil = require('../extraScripts/dbConnect');
const ObjectId = require('mongodb').ObjectID;


const replayRouter = express.Router();

// anything sent to this router must contain the ID of the original test so that we can find it in mongo and retrieve the arrays that we need
function router() {
	replayRouter.route('/')
		.get((req, res) => {
			res.redirect('/auth/profile')
		});
	replayRouter.route('/:id')
		.get((req, res) => {
			const reqID = req.params.id;
			(async function mongo() {
				try {
					let db = mongoUtil.getDb();
					const col = db.collection('userTracking');

					const testFound = await col.findOne({
						"_id": ObjectId(reqID)
					});
					if (testFound === null) {
						console.log('Probably a cookie issue with someone having an old cookie when testing');
					} else {
						const userArray = testFound.recMoves;
						const initInfo = testFound.initInformation;
						const ourString = `<iframe src="http://localhost:3000/site/5bd65271703fcb113831d6b6" class="ourContainer" style="position:relative; height: ${initInfo.userHeight}px; width: ${initInfo.userWidth}px">`;
						res.render('replay', {
							userArray,
							initInfo,
							ourString
						});
					}
				} catch (err) {
					console.log(err.stack);
				}
			}());

		});
	return replayRouter;
}
// exporting out the router
module.exports = router;