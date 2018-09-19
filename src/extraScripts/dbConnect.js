const {
    MongoClient
} = require('mongodb');

let _db;

module.exports = {

  connectToServer: function( callback ) {
    MongoClient.connect( "mongodb://localhost:27017/usability", function( err, db ) {
      _db = db;
      return callback( err );
    } );
  },

  getDb: function() {
    return _db;
  }
};

