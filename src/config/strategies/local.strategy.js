const passport = require('passport');
const {
	Strategy
} = require('passport-local');
const bcrypt = require('bcrypt-nodejs');
const UserModel = require('../../models/userStorage.model');

// this is for cookies
module.exports = function localStrategy() {
	passport.use(new Strategy({
		usernameField: 'username',
		passwordField: 'password'
	}, (username, password, done) => {
		UserModel.findOne({ username: username }).then(resp => {
			if (resp === null) {
				// no user
				done(null, false);
			} else if (resp != null) {
				bcrypt.compare(password, resp.password, (err, res) => {
					if (res === true) {
						done(null, resp);
					} else {
						// Return something that says bad pass
						done(null, false);
					}
				});
			} else {
				done(null, false);
			}
		}).catch(err => console.log(err.stack))
	}));
};