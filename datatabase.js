const MongoClient = require('mongodb').MongoClient;
const dburl = 'mongodb://@ds012198.mlab.com:12198/mydb';
//const dburl = 'mongodb://localhost:27017';
const dbName = 'mydb';

let _db

module.exports = {
  connect: (callback) => {
    MongoClient.connect(dburl, function(err, client) {
      // if (err) {
      //   console.log(err);
      // }
      if (client) {
        _db = client.db(dbName);
      }
      return callback(err);
    })
  },

  getDb: () => {
    return _db;
  }
}