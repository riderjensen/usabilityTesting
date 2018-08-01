// required files
const express = require('express');

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
                url,
                testOne,
                testTwo,
                testThree
            } = req.body;
            console.log(url);
            console.log(testOne);
            console.log(testTwo);
            console.log(testThree);
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