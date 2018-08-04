// required files
const express = require('express');
const { MongoClient } = require('mongodb');
const mongoose = require('../models/model');
const webStorage = mongoose.model('webStorage');
const extraScripts = require('../extraScripts/extra');

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
            testSeventeen, testEighteen, testNineteen, testTwenty];
            // fix array issues if they do not submit enough
            // this will need to be optimized and fixed
            while(testArray[testArray.length-1] === undefined){
                testArray.pop();
            }
            const date = new Date();
            const addedOn = date.getDate();
            const needLogIn = false;

            const url = 'mongodb://localhost:27017';
            const dbName = 'usabilityTesting';
            (async function addTest() {
                let client;
                try {
                    client = await MongoClient.connect(url);
                    const db = client.db(dbName);
                    const col = db.collection('websites');    
                    const website = new webStorage ({ 
                        webURL,
                        testArray,
                        needLogIn,
                        addedOn
                    });
                    await col.insert(website, (err) => {
                        var objectId = website._id;
                        const { requestURL } = extraScripts;
                        requestURL(webURL, objectId);
                        req.webNoLogInID = objectId;
                        req.webNoLogInNav = nav;
                        req.webNoLogInArray = testArray;
                        next();
                    });
                    }
                    catch(err){
                        console.log(err);
                    }
            }());
        }, siteWithNoLogIn);
    siteRouter.route('/logIn')
        .get((req, res) => {
            res.render('logIn', {
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
            testSeventeen, testEighteen, testNineteen, testTwenty];
            // fix array issues if they do not submit enough
            // this will need to be optimized and fixed
            while(testArray[testArray.length-1] === undefined){
                testArray.pop();
            }
            
            const date = new Date();
            const addedOn = date.getDate();
            const needLogIn = true;

            const url = 'mongodb://localhost:27017';
            const dbName = 'usabilityTesting';
            (async function addTest() {
                let client;
                try {
                    client = await MongoClient.connect(url);
                    const db = client.db(dbName);
                    const col = db.collection('websites');    
                    const website = new webStorage ({ 
                        webURL,
                        testArray,
                        needLogIn,
                        addedOn
                    });
                    await col.insert(website, (err) => {
                        var objectId = website._id;
                        const { requestIframe } = extraScripts;
                        requestIframe(webURL, objectId);       
                        req.webLogObjectID = objectId;     
                        req.webLogInURL = website.webURL;
                        req.webLogInNav = nav;
                        req.webLogInArray = testArray;
                        next();
                    });
                    }
                    catch(err){
                        console.log(err);
                    }
            }());
        }, siteWithLogIn);
    siteRouter.route('/:id')
        .get((req, res) => {
            const url = 'mongodb://localhost:27017';
            const dbName = 'usabilityTesting';
            const reqID = req.params.id;
            (async function mongo() {
                let client;
                try {
                    client = await MongoClient.connect(url);

                    const db = client.db(dbName);

                    const col = await db.collection('websites');
                    await col.findOne({ reqID });

                    res.render(`../../files/${reqID}`);
                } catch (err) {
                    console.log(err.stack);
                }
            }());
        });
    return siteRouter;
}
// exporting out the router
module.exports = router;

// function to redirect to logIn site with URL
function siteWithLogIn(req, res){
    let nav = req.webLogInNav;
    let webLogInURLPull = `http://localhost:3000/site/${req.webLogObjectID}`;
    let webLogInArrayPull = req.webLogInArray;
    res.render('logIn', {
        nav,
        webLogInURLPull,
        webLogInArrayPull
    });
}
function siteWithNoLogIn(req, res){
    let nav = req.webNoLogInNav;
    let webNoLogInURLPull = `http://localhost:3000/site/${req.webNoLogInID}`;
    let webNoLogInArrayPull = req.webNoLogInArray;
    res.render('noLog', {
        nav,
        webNoLogInURLPull,
        webNoLogInArrayPull
    });
}