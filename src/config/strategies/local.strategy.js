const passport = require('passport');
const {
	Strategy
} = require('passport-local');
const bcrypt = require('bcrypt-nodejs');
const mongoUtil = require('../../extraScripts/dbConnect');

// this is for cookies
module.exports = function localStrategy() {
	passport.use(new Strategy({
		usernameField: 'username',
		passwordField: 'password'
	}, (username, password, done) => {
		(async function mongo() {
			try {
				let db = mongoUtil.getDb();
				const col = db.collection('users');
				const user = await col.findOne({
					username
				});

				if (user === null) {
					// no user
					done(null, false);
				} else if (user != null) {
					bcrypt.compare(password, user.password, (err, res) => {
						if (res === true) {
							done(null, user);
						} else {
							console.log('bad pass')
							// Return something that says bad pass
							done(null, false);
						}
					});
				} else {
					done(null, false);
				}
			} catch (err) {
				console.log(err.stack);
			}
		}());
	}));
};