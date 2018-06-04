const express = require('express');
const app = express();
const port = process.env.port || 3000;
const dns = require('dns');

// const MongoClient = require('mongodb').MongoClient;
// // Connection URL
// const dburl = '';
// // Database Name
// const dbName = 'myproject';
// // Use connect method to connect to the server
// MongoClient.connect(dburl, function(err, client) {
//   console.log(err);  
//   console.log("Connected successfully to server");
//   const db = client.db(dbName);
//   client.close();
// });

app.use(require('./routes/paths'));

app.listen(port);