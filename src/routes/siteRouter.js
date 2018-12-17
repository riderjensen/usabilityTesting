// required files
const express = require('express');

const siteRouter = express.Router();

const siteController = require('../controllers/siteController');

function router() {
	siteRouter.route('/')
		.post(siteController.createTest);
	siteRouter.route('/testCreate')
		.get(siteController.fixRefreshIssueOnCreate);
	siteRouter.route('/com')
		.get(siteController.testCompleted);
	siteRouter.route('/recordResults')
		.post(siteController.recordTheResults);
	siteRouter.route('/:id')
		.get(siteController.getIDPage);
	return siteRouter;
}
module.exports = router;