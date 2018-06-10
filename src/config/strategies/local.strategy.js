const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

// this is for cookies
module.exports = function localStrategy() {
    passport.use(new Strategy({
        usernameField: 'username',
        passwordField: 'password'
    }, (username, password, done) => {
        const url = 'mongodb://localhost:27017';
        const dbName = 'usability';
        (async function mongo() {
            let client;

            try {
                client = await MongoClient.connect(url);

                const db = client.db(dbName);
                const col = db.collection('users');
                const user = await col.findOne({ username });

                if (user === null) {
                    // no user
                    done(null, false);
                } else if (user != null) {
                    bcrypt.compare(password, user.password, (err, res) => {
                        if (res === true) {
                            // good user good password
                            done(null, user);
                        } else {
                            // bad password
                            done(null, false);
                        }
                    });
                } else {
                    done(null, false);
                }
            } catch (err) {
                console.log(err.stack);
            }
            // Close connection
            client.close();
        }());
    }));
};
