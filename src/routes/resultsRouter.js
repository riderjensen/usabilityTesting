// required files
const express = require('express');


const replayController = require('../controllers/replayController');
const resultsController = require('../controllers/resultsController');

const resultsRouter = express.Router();

// anything sent to this router must contain the ID of the original test so that we can find it in mongo and retrieve the arrays that we need
function router() {
	resultsRouter.route('/')
		.get(replayController.sendHome);
	resultsRouter.route('/:id')
		.get(resultsController.displayTheResults);
	return resultsRouter;
}
module.exports = router;