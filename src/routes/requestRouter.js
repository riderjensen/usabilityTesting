// required files
const express = require('express');

const requestController = require('../controllers/requestController');

const reqRouter = express.Router();

function router() {
	reqRouter.route('/')
		.get(requestController.reqAPage);
	return reqRouter;
}
// exporting out the router
module.exports = router;