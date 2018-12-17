const express = require('express');

const redirectController = require('../controllers/redirectController');

const testRedirectRouter = express.Router();

function router() {
	testRedirectRouter.route('/:id')
		.get(redirectController.redirectUsers);
	return testRedirectRouter;
}
module.exports = router;