// required files
const express = require('express');

const replayController = require('../controllers/replayController');

const replayRouter = express.Router();

// anything sent to this router must contain the ID of the original test so that we can find it in mongo and retrieve the arrays that we need
function router() {
	replayRouter.route('/')
		.get(replayController.sendHome);
	replayRouter.route('/com')
		.get(replayController.replayComplete);
	replayRouter.route('/first/:id')
		.get(replayController.firstPageOfTest);
	replayRouter.route('/:id')
		.get(replayController.replayPage);
	return replayRouter;
}
// exporting out the router
module.exports = router;