// required files
const express = require('express');

const authController = require('../controllers/authController');

const authRouter = express.Router();

function router() {
	authRouter.route('/')
		.all(authController.checkUserLog);

	authRouter.route('/signUp')
		.post(authController.postToSignUp)
		.get(authController.sendRedirect);

	authRouter.route('/signIn')
		.post(authController.postSignIn)
		.get(authController.sendRedirect);

	authRouter.route('/profile')
		.all(authController.checkUserLog)
		.get(authController.loadProfile);

	authRouter.route('/delete')
		.all(authController.checkUserLog)
		.post(authController.deleteTest);

	authRouter.route('/copy')
		.all(authController.checkUserLog)
		.post(authController.copyTest);
	return authRouter;
}
// exporting out the router
module.exports = router;