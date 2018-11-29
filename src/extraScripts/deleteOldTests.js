const fs = require('fs');
const mongoUtil = require('./dbConnect');
const ObjectId = require('mongodb').ObjectID;

// need to delete website IDs from users collection
// delete
module.exports = {
midNight: function(){
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

}
};