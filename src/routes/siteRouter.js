// required files
const express = require('express');
const {
    MongoClient
} = require('mongodb');
const mongoose = require('../models/model');
const webStorage = mongoose.model('webStorage');
const extraScripts = require('../extraScripts/extra');
const mongoUtil = require('../extraScripts/dbConnect');

const siteRouter = express.Router();

function router(nav) {
    siteRouter.route('/noLog')
        .get((req, res) => {
            res.render('noLog', {
                nav
            });
        })
        .post((req, res, next) => {
            const {
                webURL,
                testOne,
                testTwo,
                testThree,
                testFour,
                testFive,
                testSix,
                testSeven,
                testEight,
                testNine,
                testTen,
                testEleven,
                testTwelve,
                testThirteen,
                testFourteen,
                testFifteen,
                testSixteen,
                testSeventeen,
                testEighteen,
                testNineteen,
                testTwenty
            } = req.body;
            const testArray = [testOne, testTwo, testThree, testFour, testFive, testSix, testSeven, testEight,
                testNine, testTen, testEleven, testTwelve, testThirteen, testFourteen, testFifteen, testSixteen,
                testSeventeen, testEighteen, testNineteen, testTwenty
            ];

            // this will need to be optimized and fixed
            while (testArray[testArray.length - 1] === undefined) {
                testArray.pop();
            }
            const date = new Date();
            const addedOn = date.getDate();

            (async function addTest() {
                try {

                    let db = mongoUtil.getDb();
                    const col = db.collection('websites');

                    const website = new webStorage({
                        webURL,
                        testArray,
                        addedOn
                    });
                    await col.insertOne(website, (err) => {
                        var objectId = website._id;
                        const {
                            requestURL
                        } = extraScripts;
                        requestURL(webURL, objectId);
                        req.webNoLogInID = objectId;
                        req.webNoLogInNav = nav;
                        req.webNoLogInArray = testArray;
                        next();
                    });
                } catch (err) {
                    console.log(err);
                }
            }());
        }, siteWithNoLogIn);
    siteRouter.route('/:id')
        .get((req, res) => {
            const reqID = req.params.id;

            // setting timeout for slower loading pages -- need to fix so that we only render once we have the whole body
            // maybe passing a value from the scrapper function to this function with a boolean?

            setTimeout(function () {
                res.render(`../../files/${reqID}`);
            }, 1000);
        });
    return siteRouter;
}
// exporting out the router
module.exports = router;

function siteWithNoLogIn(req, res) {
    let nav = req.webNoLogInNav;
    let webNoLogInURLPull = `http://localhost:3000/site/${req.webNoLogInID}`;
    let webNoLogInArrayPull = req.webNoLogInArray;
    res.render('noLog', {
        nav,
        webNoLogInURLPull,
        webNoLogInArrayPull
    });
}