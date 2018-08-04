const request = require('request');
const fs = require('fs');
const { MongoClient } = require('mongodb');

module.exports = {
    requestURL(URL, id) {
        // Need to check for any issues in the requesting URL before moving it to the request
        // this function creates the index file on the server, need to add validation for a correct URL
        const requestingURL = URL;
        try{
            const s = request(requestingURL);

            s.on('data', (chunk) => {
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
    
                // need to create file name based on id number of submission
                fs.appendFile(`files/${id}.ejs`, changeStyleBack, (err) => {
                    if (err) throw err;
                });
            });
            s.on('end', () => {
                console.log('File Completed');
            });
        } catch (err){
            console.log(err);
        }
    },
    requestIframe(URL, id) {
        // this is creating pages with just iframes
        fs.createReadStream('src/views/iframe-template.ejs').pipe(fs.createWriteStream(`files/${id}.ejs`));
        fs.readFile(`files/${id}.ejs`, 'utf-8', function(err, data){
            if (err) throw err;
        
            let newValue = data.replace(`src=""`, `src="${URL}"`);
        
            fs.writeFile(`files/${id}.ejs`, newValue, 'utf-8', function (err) {
              if (err) throw err;
              console.log('filelistAsync complete');
            });
          });
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
            deleteOldFiles(theDate);   //      <-- This is the function being called at midnight.
            resetAtMidnight();  //      Then, reset again next midnight.
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
                var myquery = { createdAt: date };
                await col.deleteMany(myquery, function(err, obj) {
                    if (err) throw err;
                    console.log(obj.result.n + " document(s) deleted");
                    db.close();
                  });
                }
                catch(err){
                    console.log(err);
                }
        }());
    }
};

