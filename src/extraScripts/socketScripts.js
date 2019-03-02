const request = require('request');
const shortid = require('shortid');

const UserTrackingModel = require('../models/useTrack.model');
const WebsiteModel = require('../models/websiteStorage.model');


module.exports = (io) => {
	// socket.io
	io.on('connection', (socket) => {
		socket.on('website', data => {
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
}