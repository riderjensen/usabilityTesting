const dbCon = require('./src/extraScripts/dbConnect');

dbCon.connectToServer(function (err) {
	// start the rest of app here

	// required statments
	const express = require('express');
	const passport = require('passport');
	const bodyParser = require('body-parser');
	const cookieParser = require('cookie-parser');
	const session = require('express-session');
	const mongoose = require('mongoose');
	const request = require('request');
	const mongoUtil = require('./src/extraScripts/dbConnect');
	const ObjectId = require('mongodb').ObjectID;
	const shortid = require('shortid');
	const flash = require('connect-flash');
	const fs = require('fs');

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

	// creating the application and attaching to socket	
	const app = express();
	const server = require('http').Server(app);
	const io = require('socket.io')(server);
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
		resave: false,
		saveUninitialized: true
	}));
	app.use(bodyParser.json());
	// used for passport authentication
	require('./src/config/passport')(app);
	require('./src/config/strategies/local.strategy')(passport);
	// Correcting all CSS and JS file areas
	app.use(express.static(`${__dirname}/public/`));
	app.use(flash());

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
	const requestRouter = require('./src/routes/requestRouter.js')();
	app.use('/req', requestRouter);

	// any replays pass through this area
	const replayRouter = require('./src/routes/replayRouter.js')();
	app.use('/replay', replayRouter);

	// any test main pages pass through this area
	const resultsRouter = require('./src/routes/resultsRouter.js')();
	app.use('/results', resultsRouter);

	// 404
	app.use(function (err, req, res, next) {
		console.log(err);
		res.status(404).render('404');
	})

	// getting our index served
	app.get('/', (req, res) => {
		// flash for sign in errors
		let ourmsg = req.flash('error')
		res.render('index', {
			message: ourmsg
		});
	});

	// need to delete website IDs from users collection
	// delete
	function midNight() {
		setInterval(() => {
			(async function deleteWebsiteFromDB() {
				try {
					let db = mongoUtil.getDb();
					const col = db.collection('websites');

					const date = new Date();
					const daysToDeletion = 30;
					const deletionDate = new Date(date.setDate(date.getDate() - daysToDeletion));
					let myquery = {
						createdAt: {
							$lt: deletionDate
						}
					};

					// find all the ones made pasts my deletion date
					await col.find(myquery).toArray(function (err, obj) {
						if (err) throw err;
						obj.forEach(async (item) => {
							try {
								let webCol = db.collection('users');
								let newQuery = {
									$pull: {
										projects: {
											objectId: item._id
										}

									}
								};
								// delete from the project array in users
								await webCol.updateOne({
									"projects.objectId": ObjectId(item._id)
								}, newQuery);
								// delete all websites ones that are past the date
								await col.deleteMany(myquery, function (err, obj) {
									if (err) throw err;
								});

								// delete all associated files
								const usercol = db.collection('userTracking');
								await usercol.find(myquery, (err, obj) => {
									obj.forEach((item) => {
										item.recMoves.forEach((page) => {
											let pageID = page.pageID;
											if (pageID.length >= 15) {
												pageID = pageID + '.ejs';
											}
											fs.unlink(`src/views/files/${pageID}`, (err) => {
												if (err) console.log(err);
											});
										});
									})
								});
								// delete all user Tracking that are past the date
								await usercol.deleteMany(myquery, function (err, obj) {
									if (err) throw err;
								});

							} catch (err) {
								console.log(err)
							}
						})
					})
				} catch (err) {
					console.log(err);
				}
			}());
		}, 86400000)
	}
	midNight();





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
			const userTracking = mongoose.model('userTracking');
			(async function createNewUserTest() {
				try {
					let db = mongoUtil.getDb();
					const col = db.collection('userTracking');
					const userTestInit = new userTracking({
						initInformation: userInitData,
						recMoves: []
					});
					await col.insertOne(userTestInit, (err, docIDInserted) => {
						docsIns = docIDInserted.insertedId;
						socket.emit('testingID', docsIns);
					});
				} catch (err) {
					console.log(err);
				}
			}()).then(
				(async function addTestToWebsitesDB() {
					try {
						let db = mongoUtil.getDb();
						const col = db.collection('websites');
						// secondary pages are passing in url including ejs, need to just send cookie?
						const webTest = await col.findOne({
							"_id": ObjectId(ourCookie)
						});

						const webID = ObjectId(webTest._id);
						if (webID == ourCookie) {
							const newVals = {
								$push: {
									testArray: docsIns
								}
							};
							col.updateOne(webTest, newVals, (error) => {
								if (error) {
									throw error;
								}
							});
						} else {
							console.log('There was a problem finding the website test that this came from');
						}
					} catch (err) {
						console.log(err);
					}
				}())
			);
		});
		socket.on('userInitInformation', (data) => {
			let theCookie = data.initID;
			(async function addRecMoves() {
				try {
					let db = mongoUtil.getDb();
					const col = db.collection('userTracking');
					const cookieInDB = await col.findOne({
						"_id": ObjectId(theCookie)
					});
					db.collection('userTracking').updateOne(cookieInDB, {
						$set: {
							userData: data
						}
					})
				} catch (err) {
					console.log(err);
				}
			}());
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
						if (webTest.recMoves[pageNum + 1] == undefined) {
							nextURL = 'com'
						} else {
							nextURL = webTest.recMoves[pageNum + 1].pageID
						}
						let sendObj = {
							moves: webTest.recMoves[pageNum].cursorPoints,
							nextURL: nextURL
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


	server.listen(port, () => console.log(`App is running on ${port}`));

	// run db 
	// mongod --dbpath "C:\Program Files\MongoDB\data"

});