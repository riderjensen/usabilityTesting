const {
  MongoClient
} = require('mongodb');

let _db;

module.exports = {

  connectToServer: function (callback) {
    MongoClient.connect("mongodb://localhost:27017", {
      useNewUrlParser: true
    }, function (err, client) {
      _db = client.db('usabilityTesting');
      return callback(err);
    });
  },

  getDb: function () {
    return _db;
  }
};