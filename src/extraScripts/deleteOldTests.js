const fs = require('fs');

const WebsiteStorageModel = require('../models/websiteStorage.model');
const UserModel = require('../models/userStorage.model');
const UserTrackingModel = require('../models/useTrack.model');

// need to delete website IDs from users collection
// delete
module.exports = {
	midNight: function () {

		const date = new Date();
		const daysToDeletion = 30;
		const deletionDate = new Date(date.setDate(date.getDate() - daysToDeletion));

		let myquery = {
			createdAt: {
				$lt: deletionDate
			}
		};

		WebsiteStorageModel.find({
			createdAt: {
				$lt: deletionDate
			}
		}).toArray(function (err, obj) {
			if (err) throw err;
			obj.forEach(item => {
				// delete from the project array in users
				UserModel.updateOne({
					"projects.objectId": item._id
				}, {
						$pull: {
							projects: {
								objectId: item._id
							}

						}
					});
				// delete all websites ones that are past the date
				WebsiteStorageModel.deleteMany(myquery, function (err, obj) {
					if (err) throw err;
				});

				// delete all associated files
				UserTrackingModel.find(myquery, (err, obj) => {
					obj.forEach((item) => {
						item.recMoves.forEach(page => {
							if (page.pageID.length >= 15) {
								page.pageID = page.pageID + '.ejs';
							}
							fs.unlink(`src/views/files/${page.pageID}`, (err) => {
								if (err) console.log(err);
							});
						});
					})
				});
				// delete all user Tracking that are past the date
				UserTrackingModel.deleteMany(myquery, function (err, obj) {
					if (err) throw err;
				});

			})
		})
	}

};