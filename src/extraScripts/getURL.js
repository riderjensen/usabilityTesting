const request = require('request');
const fs = require('fs');

const requestingURL = 'http://www.riderjensen.com'
const s = request(requestingURL);

let chunkNumber = 0;

s.on('data', function(chunk){
    chunkNumber++;
    console.log("CHUNK NUMBER: " + chunkNumber);
    var chunkString = chunk.toString();

    let changeHREFString = chunkString.replace(/href="http/g, 'HREF="HTTP');
    let replaceHREFString = changeHREFString.replace(/href="\/|href="/g, 'href="'+requestingURL+'/');
    let changeHREFBack = replaceHREFString.replace(/HREF="HTTP/g, 'href="http');
    let changeSRCString = changeHREFBack.replace(/src="http/g, 'SRC="HTTP');
    let replaceSRCString = changeSRCString.replace(/src="\/|src="/g, 'src="'+requestingURL+'/');
    let changeSRCBack = replaceSRCString.replace(/SRC="HTTP/g, 'src="http');
    let changeStyleURL = changeSRCBack.replace(/url\(http/g, 'URL\(HTTP');
    let replaceStyleURL = changeStyleURL.replace(/url\(/g, 'url('+requestingURL+'/');
    let changeStyleBack = replaceStyleURL.replace(/URL\(HTTP/g, 'url\(http');
    
    fs.appendFile('index.html', changeStyleBack, function(err) {
        if (err) throw err;
    })

});

s.on('end', function() {
    console.log('DONE');
})