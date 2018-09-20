
const dbCon = require( './src/extraScripts/dbConnect' );

dbCon.connectToServer( function( err ) {
	// start the rest of app here



	// this code should make it so that we can import the db connection to any place we need it without having to reconnect
	// UNTESTED
	// const mongoUtil = require( 'dbConnect' );
	// let db = mongoUtil.getDb();
	// db.collection( 'users' ).find();

} );



// required statments
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const extraScripts = require('./src/extraScripts/extra');
const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost/usabilityTesting';
const connectOptions = {
    keepAlive: true,
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE
};
// Connect to MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(mongoURI, connectOptions, (err, db) => {
    if (err) console.log('Error', err);
});

const nav = [{
        Link: '/auth/profile',
        Text: 'Profile'
    },
    {
        Link: '/auth/stats',
        Text: 'Stats'
    }
];

// creating the application
const app = express();
// defining the port to use
const port = process.env.PORT;

// Middleware
// This lets you get information from the user
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: false,
    useNewUrlParser: true
}));
app.use(session({
    secret: 'library',
}));
app.use(bodyParser.json());
// used for passport authentication
require('./src/config/passport')(app);
require('./src/config/strategies/local.strategy')(passport);
// Correcting all CSS and JS file areas
app.use(express.static(`${__dirname}/public/`));

// setting the view engine and where the views are stored
app.set('views', './src/views');
app.set('view engine', 'ejs');

// all movement for the authorization route on the domain
const authRouter = require('./src/routes/authRouter.js')(nav);
app.use('/auth', authRouter);

// site routes go here
const siteRouter = require('./src/routes/siteRouter.js')(nav);
app.use('/site', siteRouter);

// any requests pass through this area
const requestRouter = require('./src/routes/requestRouter.js')(nav);
app.use('/req', requestRouter);

// getting our index served
app.get('/', (req, res) => {
    res.render('index');
});


// this function checks the files each night at midnight and deletes anything at a month old
function midNight() {
    const {
        resetAtMidnight
    } = extraScripts;
    resetAtMidnight();
}
midNight();


// Our app is listening
app.listen(port, () => console.log(`App is running on ${port}`));

// run db
// mongod --dbpath "C:\Program Files\MongoDB\data"