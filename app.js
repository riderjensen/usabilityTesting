// required statments
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const mongoUtil = require('./src/extraScripts/dbConnect');
const ObjectId = require('mongodb').ObjectID;
const request = require('request');
const shortid = require('shortid');
const flash = require('connect-flash');
const compression = require('compression');
const helmet = require('helmet');
const deleteAtMidnight = require('./src/extraScripts/deleteOldTests');

const UserTrackingModel = require('./src/models/useTrack.model');
const WebsiteModel = require('./src/models/websiteStorage.model');

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
	let user;
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
		let docsIns;
		// adding userTracking model for use in tracking

		const userTestInit = new UserTrackingModel({
			initInformation: userInitData,
			recMoves: []
		});
		userTestInit.save()
			.then(resp => {
				socket.emit('testingID', resp.insertedId);
			}).then(_ => {
				// secondary pages are passing in url including ejs, need to just send cookie?

				WebsiteModel.findOneAndUpdate({ id: ourCookie }, {
					$push: {
						testArray: docsIns
					}
				}).then(webTest => {
					if (webTest === undefined) {
						console.log('There was a problem finding the website test that this came from');

					}
				}).catch(err => console.log(err));
			});
		socket.on('userInitInformation', (data) => {
			UserTrackingModel.findOneAndUpdate({ id: data.initID }, {
				$set: {
					userData: data
				}
			}).then(cookieInDB => {
				if (cookieInDB === undefined) {
					console.log('User init information failed');
				}
			});
		});
		socket.on('testingInfo', (data) => {
			let ourCookie = data.userID;
			(async function addRecMoves() {
				try {
					let db = mongoUtil.getDb();
					const col = db.collection('userTracking');
					const cookieInDB = await col.findOne({
						"_id": ObjectId(ourCookie)
					});
					const webID = ObjectId(cookieInDB._id);
					if (webID == ourCookie) {
						db.collection('userTracking').updateOne(cookieInDB, {
							$push: {
								'recMoves.$[i].cursorPoints': {
									$each: data.recMoves
								}
							}
						}, {
								arrayFilters: [{
									"i.secretID": data.secret
								}]
							})
						if (data.endingScroll) {
							db.collection('userTracking').updateOne(cookieInDB, {
								$set: {
									'recMoves.$[i].endingScroll': data.endingScroll
								}
							}, {
									arrayFilters: [{
										"i.secretID": data.secret
									}]
								})
						} else {
							db.collection('userTracking').updateOne(cookieInDB, {
								$set: {
									'recMoves.$[i].endingScroll': 0
								}
							}, {
									arrayFilters: [{
										"i.secretID": data.secret
									}]
								})
						}
					} else {
						console.log(`something wrong with ${ourCookie}, we could not find the test in the db`);
					}
				} catch (err) {
					console.log(err);
				}
			}());
		});
		socket.on('newPageReached', (data) => {
			let ourCookie = data.cookie;
			let ourPage = data.page;
			let newID = shortid.generate();
			(async function createPageObj() {
				try {
					let db = mongoUtil.getDb();
					const col = db.collection('userTracking');
					const cookieInDB = await col.findOne({
						"_id": ObjectId(ourCookie)
					});
					// not sending the correct cookie
					const webID = ObjectId(cookieInDB._id);
					if (webID == ourCookie) {
						await db.collection('userTracking').updateOne(cookieInDB, {
							$push: {
								recMoves: {
									pageID: ourPage,
									secretID: newID,
									cursorPoints: []
								}
							}
						})
						socket.emit('returnSecret', newID);
					} else {
						console.log(`Issue on new page reached`);
					}
				} catch (err) {
					console.log(err);
				}
			}());
		});
		socket.on('replayInformationID', (data) => {
			let ourID = data.testID;
			let pageNum = data.pageNum;
			(async function getOurRecordedMoves() {
				try {
					let db = mongoUtil.getDb();
					const col = db.collection('userTracking');
					const webTest = await col.findOne({
						"_id": ObjectId(ourID)
					});
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
					} else {
						console.log('no find')
					}
				} catch (err) {
					console.log(err);
				}
			}())
		});
		socket.on('disconnect', () => {
			// any events we need to fire on disconnection of a socket
		});
	});

	mongoose.connect('mongodb://localhost:27017/usabilityTesting', {
		useNewUrlParser: true
	}).then(_ => {
		server.listen(port, () => console.log(`App is running on ${port}`));

	})

	// run db 
	// mongod --dbpath "C:\Program Files\MongoDB\data"
