// required files
const express = require('express');
const { MongoClient } = require('mongodb');
const passport = require('passport');
const bcrypt = require('bcrypt');

const authRouter = express.Router();

function router(nav) {
    authRouter.route('/signUp')
        .get((req, res) => {
            res.redirect('/auth/profile');
        })
        .post((req, res) => {
            const { username, password } = req.body;
            const url = 'mongodb://localhost:27017';
            const dbName = 'usability';
            bcrypt.hash(password, 10, (err, hash) => {
                (async function addUser() {
                    let client;
                    try {
                        client = await MongoClient.connect(url);

                        const db = client.db(dbName);
                        const col = db.collection('users');
                        const userFromDB = await col.findOne({ username });
                        if (userFromDB) {
                            console.log('Duplicate User');
                        } else {
                            const user = { username, password: hash };
                            await col.insertOne(user);
                            res.redirect('/auth/profile');
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }());
            });
        });
    authRouter.route('/signIn')
        .get((req, res) => {
            res.redirect('auth/profile');
        })
        .post(passport.authenticate('local', {
            successRedirect: '/auth/profile',
            failureRedirect: '/'
        }));
    authRouter.route('/profile')
        .all((req, res, next) => {
            if (req.user) {
                next();
            } else {
                res.redirect('/');
            }
        })
        .get((req, res) => {
            // need to retrieve user data and send to screen
            const userData = req.user;
            res.render('profile', {
                userData,
                nav
            });
        })
        // this will be for sending data into the database
        .post((req, res) => {
            const { username, password } = req.body;
            const url = 'mongodb://localhost:27017';
            const dbName = 'usability';
            console.log(username);
            console.log(password);
            (async function storeData() {
                let client;
                try {
                    client = await MongoClient.connect(url);

                    const db = client.db(dbName);
                    const col = db.collection('users');
                    const userFromDB = await col.findOne({ username });
                    const newVals = {
                        $push: {
                            dataCollection: {
                                // Find out what data to push
                                // Link: { _id: new ObjectID(_id) },
                                // Text: 'Your Chat Room'
                            }
                        }
                    };
                    col.update(userFromDB, newVals, (error) => {
                        if (error) {
                            throw error;
                        } else {
                            console.log(`Pushed ${newVals} to the db`);
                        }
                    });
                    res.send('Data posted');
                } catch (error) {
                    console.log(error);
                }
            }());
        });
    authRouter.route('/stats')
        .all((req, res, next) => {
            if (req.user) {
                next();
            } else {
                res.redirect('/');
            }
        })
        .get((req, res) => {
            res.send('This is the stats page');
        });
    return authRouter;
}
// exporting out the router
module.exports = router;