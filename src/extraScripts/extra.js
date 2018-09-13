const request = require('request');
const fs = require('fs');
const {
    MongoClient
} = require('mongodb');

// This will be our JS file that we load into the page that will track everything that the user does
const ourScript = '<script src="http://usable.io/test/test.js"></script>';

module.exports = {
    requestURL(URL, id) {
        // Need to check for any issues in the requesting URL before moving it to the request
        // this function creates the index file on the server, need to add validation for a correct URL
        let requestingURL = URL;
        const splitURL = requestingURL.split("");
        // check to see if they added http
        if (splitURL[0] != 'h') {
            requestingURL = 'http://' + requestingURL;
            console.log('added http');
        }
        const res = requestingURL.split("/");
        const rootURL = res[0] + '//' + res[2];
        let largeString = '';

        try {
            const s = request(requestingURL);
            s.on('response', (response) => {
                if (response.statusCode != '200') {
                    console.log('Bad response from server');
                }
            })
            s.on('data', (chunk) => {
                const chunkString = chunk.toString();
                largeString += chunkString;

            });
            s.on('end', () => {
                // change HREF links to link back to request URL
                const changeHREFString = largeString.replace(/href="http/g, 'HREF="HTTP');
                const replaceHREFString = changeHREFString.replace(/href="\/|href="/g, `href="${rootURL}/`);
                const changeHREFBack = replaceHREFString.replace(/HREF="HTTP/g, 'href="http');

                // change SRC links to link back to request URL
                const changeSRCString = changeHREFBack.replace(/src="http/g, 'SRC="HTTP');
                const replaceSRCString = changeSRCString.replace(/src="\/|src="/g, `src="${rootURL}/`);
                const changeSRCBack = replaceSRCString.replace(/SRC="HTTP/g, 'src="http');
                // change inline stlyes on any background image loaded
                const changeStyleURL = changeSRCBack.replace(/url\(http/g, 'URL(HTTP');
                const replaceStyleURL = changeStyleURL.replace(/url\(\/|url\(/g, `url(${rootURL}/`);
                const changeStyleBack = replaceStyleURL.replace(/URL\(HTTP/g, 'url(http');

                // add our JS script to the end of the file, name is at top of file to change
                const addOurScript = changeStyleBack.replace(/<\/body>/, `${ourScript}<\/body>`);

                // need to create file name based on id number of submission
                fs.appendFile(`files/${id}.ejs`, addOurScript, (err) => {
                    if (err) throw err;
                });
            });
        } catch (err) {
            console.log(err);
        }





    },
    resetAtMidnight() {
        let now = new Date();
        let theDate = now.getDate();
        let night = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1, // the next day
            0, 0, 0 // at 00:00:00 hours
        );
        let msToMidnight = night.getTime() - now.getTime();

        setTimeout(() => {
            deleteOldFiles(theDate); //      <-- This is the function being called at midnight.
            resetAtMidnight(); //      Then, reset again next midnight.
        }, msToMidnight);
    },
    // this is called every night at midnight to delete files that are a month old
    deleteOldFiles(date) {
        const url = 'mongodb://localhost:27017';
        const dbName = 'usabilityTesting';
        (async function deleteFromDB() {
            let client;
            try {
                client = await MongoClient.connect(url);
                const db = client.db(dbName);
                const col = db.collection('websites');
                var myquery = {
                    createdAt: date
                };
                await col.deleteMany(myquery, function (err, obj) {
                    if (err) throw err;
                    console.log(obj.result.n + " document(s) deleted");
                    db.close();
                });
            } catch (err) {
                console.log(err);
            }
        }());
    }
};