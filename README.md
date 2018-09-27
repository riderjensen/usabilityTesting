## Usability Testing Server
This is a school project designed to create a website and database that will allow users to easily create usability tests and send them to people.
User should be able to do the following:

* Submit a link for a page that they want tested
* Submit a number of items they would like completed when they are testing
* Have a URL that will show them feedback on the website

## To Do

* Use [this](https://github.com/ogt/valid-url) and [this](https://github.com/dylang/shortid) to create short links?
* Add test requirements box to the bottom of page
* Can we do those purely through an outside JavaScript file that will keep time?
* Post javascript results to the test with all the answers to the questions
* When parsing, only pull files from head and script tags to change src?
* Store those sources in a seperate file that we include in their head so that it stays the same accross pages?
* Store the response in the same file each time and change out the body text? Then we dont have to reload JS?
* Add event listener on window lose focus so that we could show a message to user that tester is not active on it?

## Codepen links

* [mouse tracking](https://codepen.io/riderjensen/pen/xaRNEy)

## Broken List

* 404 page when we hit too many redirects

## Untested

* Replay route