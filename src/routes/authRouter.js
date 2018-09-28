// required files
const express = require('express');
const {
    MongoClient
} = require('mongodb');
const mongoose = require('../models/model');
const mongoUtil = require('../extraScripts/dbConnect');
const userStorage = mongoose.model('userStorage');
const passport = require('passport');
const bcrypt = require('bcrypt');

const authRouter = express.Router();

function router(nav) {
    authRouter.route('/signUp')
        .get((req, res) => {
            res.redirect('/auth/profile');
        })
        .post((req, res) => {
            const {
                username,
                password
            } = req.body;
            bcrypt.hash(password, 10, (err, hash) => {
                (async function addUser() {
                    try {

                        let db = mongoUtil.getDb();
                        const col = db.collection('users');

                        // Creating variables to send into the database
                        const date = new Date();
                        const addedOn = date.getDate();
                        const emptyArray = []; // this is to initialize an array of projects that is not filled yet
                        const password = hash;


                        const userFromDB = await col.findOne({
                            username
                        });
                        if (userFromDB) {
                            console.log('Duplicate User');
                        } else {
                            const user = new userStorage({
                                username,
                                password,
                                emptyArray,
                                addedOn
                            });
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
        .post(passport.authenticate('local', {
            successRedirect: '/auth/profile',
            failureRedirect: '/'
        }))
        .get((req, res) => {
            res.redirect('auth/profile');
        });
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
    authRouter.route('/addTest')
        .all((req, res, next) => {
            if (req.user) {
                next();
            } else {
                res.redirect('/');
            }
        })
        // need to get user ID so that we can attach the test to the user tests in the user db
        .get((res, req) => {
            const {
                username,
                testID
            } = req.body;
            (async function storeData() {
                try {
                    let db = mongoUtil.getDb();
                    const col = db.collection('websites');

                    const idFromDB = await col.findOne({
                        testID
                    });
                    if (idFromDB) {
                        const usercol = db.collection('users');
                        const userFromDB = await usercol.findOne({
                            username
                        });

                        const newVals = {
                            $push: {
                                dataCollection: {
                                    // Hopefully pushing existing ID into the empty array - UNTESTED
                                    id: testID
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
                    } else {
                        console.log('No test with this ID can be found.')
                    }

                } catch (error) {
                    console.log(error);
                }
            }());
        })
    return authRouter;
}
// exporting out the router
module.exports = router;