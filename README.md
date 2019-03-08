## Usability Testing

http://178.128.5.191

A project designed to create a website and database that will allow users to easily create usability tests and send them to people.
User should be able to do the following:

* Submit a link for a page that they want tested
* Submit a number of items they would like completed when they are testing
* Have a URL that will show them feedback on the website

## Features included

The core of this project is a scraping algorithm that requests pages and assets from the desired website and all of it being under the control of our domain. Users have the option to create secure accounts and save tests.

* Record user mouse movements
* Record user mouse clicks
* Record user scrolls
* Record webpages visited
* Playback of the above items at a 1:1 speed
* Ask specific questions for users to give feedback
* Built-in modal on pages so that users can give timely feedback

## Codepen links

* [mouse tracking](https://codepen.io/riderjensen/pen/xaRNEy)

## Before Running
* You need to update your package.json in the ENV.ADDR to be reflective of where you are running this (default is localhost :8080)
* You need to change the first line in public/js/taskModal.js to reflect that same address
