// required statments
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const compression = require('compression');
const helmet = require('helmet');

// creating the application and attaching to socket	
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

require('./src/extraScripts/socketScripts')(io);

// defining the port to use
const port = process.env.PORT;

// Middleware
// This lets you get information from the user
app.use(cookieParser());
app.use(bodyParser.urlencoded({
	extended: false,
	useNewUrlParser: true
}));
app.use(session({
	secret: 'library',
	resave: false,
	saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(compression());
app.use(helmet());
// used for passport authentication
require('./src/config/passport')(app);
require('./src/config/strategies/local.strategy')(passport);
// Correcting all CSS and JS file areas
app.use(express.static(`public`));
app.use(flash());

// setting the view engine and where the views are stored
app.set('views', './src/views');
app.set('view engine', 'ejs');

// all movement for the authorization route on the domain
const authRouter = require('./src/routes/authRouter.js')();
app.use('/auth', authRouter);

// site routes go here
const siteRouter = require('./src/routes/siteRouter.js')();
app.use('/site', siteRouter);

// any requests pass through this area
const requestRouter = require('./src/routes/requestRouter.js')();
app.use('/req', requestRouter);

// any replays pass through this area
const replayRouter = require('./src/routes/replayRouter.js')();
app.use('/replay', replayRouter);

// any test main pages pass through this area
const resultsRouter = require('./src/routes/resultsRouter.js')();
app.use('/results', resultsRouter);

// any test main pages pass through this area
const testRedirect = require('./src/routes/redirectRouter.js')();
app.use('/t', testRedirect);

// 404
app.use(function (err, req, res, next) {
	console.log(err);
	res.status(404).render('404', {
		user: req.user
	});
})

// getting our index served
app.get('/', (req, res) => {
	// flash for sign in errors

	let ourmsg;
	if (req.query.duplicateUser) {
		ourmsg = 'Duplicate user, please choose a new username';
	} else {
		ourmsg = req.flash('error')
	}
	res.render('index', {
		message: ourmsg,
		user: req.user
	});
});


mongoose.connect('mongodb://localhost:27017/usabilityTesting', {
	useNewUrlParser: true
}).then(_ => {
	server.listen(port, () => console.log(`App is running on ${port}`));

}).catch(err => console.log('Cant connect to the DB'))

	// run db 
	// mongod --dbpath "C:\Program Files\MongoDB\data"
