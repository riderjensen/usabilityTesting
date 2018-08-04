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
        .post((req, res) => {
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
            console.log(`Test array: ${testArray}`);

            const date = new Date();
            const addedOn = date.getDate();

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
                        addedOn
                    });
                    await col.insertOne(website);
                    console.log(`Website: ${website}`);
                    const userFromDB = await col.findOne({ webURL });
                    console.log(`User from DB Found: ${userFromDB}`);
                    const { _id } = userFromDB;

                    const { requestURL } = extraScripts;
                    requestURL(webURL, _id);
                    
                    }
                    catch(err){
                        console.log(err);
                    }
            }());
            res.redirect('/site/nolog');
        });
    siteRouter.route('/logIn')
        .get((req, res) => {
            res.render('logIn', {
                nav
            });
        })
        .post((req, res) => {
            const {
                url,
                testOne,
                testTwo,
                testThree
            } = req.body;
            console.log(url);
            console.log(testOne);
            console.log(testTwo);
            console.log(testThree);
            res.redirect('/site/logIn');
        });
    return siteRouter;
}
// exporting out the router
module.exports = router;