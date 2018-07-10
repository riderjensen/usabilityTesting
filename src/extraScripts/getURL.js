const request = require('request');
const fs = require('fs');
const { MongoClient } = require('mongodb');

module.exports = {
    requestURL(URL) {
        // Need to check for any issues in the requesting URL before moving it to the request
        // if there are errors, need to return e
        const requestingURL = URL;
        const s = request(requestingURL);

        let chunkNumber = 0;

        s.on('data', (chunk) => {
            chunkNumber += 1;
            console.log(`CHUNK NUMBER: ${chunkNumber}`);
            const chunkString = chunk.toString();

            const changeHREFString = chunkString.replace(/href="http/g, 'HREF="HTTP');
            const replaceHREFString = changeHREFString.replace(/href="\/|href="/g, `href="${requestingURL}/`);
            const changeHREFBack = replaceHREFString.replace(/HREF="HTTP/g, 'href="http');
            const changeSRCString = changeHREFBack.replace(/src="http/g, 'SRC="HTTP');
            const replaceSRCString = changeSRCString.replace(/src="\/|src="/g, `src="${requestingURL}/`);
            const changeSRCBack = replaceSRCString.replace(/SRC="HTTP/g, 'src="http');
            const changeStyleURL = changeSRCBack.replace(/url\(http/g, 'URL(HTTP');
            const replaceStyleURL = changeStyleURL.replace(/url\(/g, `url(${requestingURL}/`);
            const changeStyleBack = replaceStyleURL.replace(/URL\(HTTP/g, 'url(http');

            // This creates a file currently but need to replace
            // with code to push it into mongo BSON file
            // See GridFS in mongo documentation
            fs.appendFile('index.html', changeStyleBack, (err) => {
                if (err) throw err;
            });
        });

        s.on('end', () => {
            console.log('DONE');
        });
    }
};

