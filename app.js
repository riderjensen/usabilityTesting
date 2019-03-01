// required statments
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const request = require('request');
const shortid = require('shortid');
const flash = require('connect-flash');
const compression = require('compression');
const helmet = require('helmet');
const deleteAtMidnight = require('./src/extraScripts/deleteOldTests');


const UserTrackingModel = require('./src/models/useTrack.model');
const WebsiteModel = require('./src/models/websiteStorage.model');

// creating the application and attaching to socket	
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
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


setInterval(() => {
	deleteAtMidnight.midNight();
}, 86400000)

// socket.io
io.on('connection', (socket) => {
	socket.on('website', (data) => {
		const splitURL = data.split("");
		// check to see if they added http
		const addedItems = splitURL[0] + splitURL[1] + splitURL[2] + splitURL[3];
		if (addedItems != 'http') {
			data = 'http://' + data;
		}
		try {
			request(data, (error, response) => {
				if (error != null) {
					socket.emit('badURL');
				} else {
					socket.emit('goodURL');
				}
			});
		} catch (err) {
			console.log(err);
		}
	});
	socket.on('initInformation', (data) => {
		// bringing in the init data that should be sent to our db on the first page load
		let ourCookie = data.initPage;
		let userInitData = {
			userHeight: data.windowHeight,
			userWidth: data.windowWidth,
			userBrowserType: data.browserType
		};
		// adding userTracking model for use in tracking

		const userTestInit = new UserTrackingModel({
			initInformation: userInitData,
			recMoves: []
		});
		userTestInit.save()
			.then(resp => {
				WebsiteModel.findById(ourCookie).then(item => {
					item.testArray.push(resp._id);
					item.save().then(resp => {
						console.log('Init saved')
					})
				})
				socket.emit('testingID', resp._id);
			}).catch(err => console.log(err));
	});
	socket.on('userInitInformation', (data) => {
		UserTrackingModel.findByIdAndUpdate(data.initID, {
			userData: data
		}).then(resp => {
			console.log('Init information updated');
		})
	});
	socket.on('testingInfo', (data) => {
		let ourCookie = data.userID;
		UserTrackingModel.findByIdAndUpdate(ourCookie, {
			"$push": {
				'recMoves.$[i].cursorPoints': {
					$each: data.recMoves
				}
			}
		}, {
				arrayFilters: [{
					"i.secretID": data.secret
				}]
			}, (err, item) => console.log('Something saved'))
		// information should be stored, you can add a callback function with (err, item) at the end if you want


		if (data.endingScroll) {
			UserTrackingModel.findByIdAndUpdate(ourCookie, {
				"$set": {
					'recMoves.$[i].endingScroll': data.endingScroll
				}
			}, {
					arrayFilters: [{
						"i.secretID": data.secret
					}]
				}, (err, item) => console.log('Something saved'))
		} else {



			UserTrackingModel.findByIdAndUpdate(ourCookie, {
				"$set": {
					'recMoves.$[i].endingScroll': 0
				}
			}, {
					arrayFilters: [{
						"i.secretID": data.secret
					}]
				}, (err, item) => console.log('Something saved'))
		}
	});

	socket.on('newPageReached', (data) => {
		let ourCookie = data.cookie;
		let ourPage = data.page;
		let newID = shortid.generate();

		UserTrackingModel.findById(ourCookie).then(cookieInDB => {
			if (cookieInDB._id == ourCookie) {
				UserTrackingModel.findById(ourCookie).then(item => {
					item.recMoves.push({
						pageID: ourPage,
						secretID: newID,
						cursorPoints: []
					})
					item.save().then(saved => {
						socket.emit('returnSecret', newID);
					})
				})
			} else {
				console.log(`Issue on new page reached`);
			}
		}).catch(err => console.log(err))

	});
	socket.on('replayInformationID', (data) => {
		let ourID = data.testID;
		let pageNum = data.pageNum;
		UserTrackingModel.findById(ourID).then(webTest => {
			if (webTest) {
				let nextURL;
				let prevArray = [];
				if (webTest.recMoves[pageNum + 1] == undefined) {
					nextURL = 'com'
				} else {
					nextURL = webTest.recMoves[pageNum + 1].pageID
					for (let i = 0; i <= pageNum; i++) {
						// prev array is supposed to get every single page before this page
						prevArray.push(webTest.recMoves[i]);
					}
				}
				let sendObj = {
					moves: webTest.recMoves[pageNum].cursorPoints,
					nextURL: nextURL,
					endingScroll: webTest.recMoves[pageNum].endingScroll,
					prevArray
				}
				socket.emit('returnMoves', sendObj);
			}
		}).catch(err => console.log(err))
	});
	socket.on('disconnect', () => {
		// any events we need to fire on disconnection of a socket
	});
});



mongoose.connect('mongodb://localhost:27017/usabilityTesting', {
	useNewUrlParser: true
}).then(_ => {
	server.listen(port, () => console.log(`App is running on ${port}`));

}).catch(err => console.log('Cant connect to the DB'))

	// run db 
	// mongod --dbpath "C:\Program Files\MongoDB\data"
