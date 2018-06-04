const express = require('express');
const app = express();
const port = process.env.port || 3000;
const dns = require('dns');

// const MongoClient = require('mongodb').MongoClient;
// // Connection URL
// const url = '';
// // Database Name
// const dbName = 'myproject';
// // Use connect method to connect to the server
// MongoClient.connect(url, function(err, client) {
//   console.log(err);  
//   console.log("Connected successfully to server");
//   const db = client.db(dbName);
//   client.close();
// });

let str = 'abcdefghijklmnopqrstuvwxyz';
str = str + str.toUpperCase();
str = str + '0123456789';

const n = 62;
const r = 3;

const findPerm = (k) => {
  const perm = [];
  const first = Math.ceil(k / Math.pow(n, r - 1));
  perm.push(first);
  const second = Math.ceil((k - (Math.pow(n, r - 1) * (first - 1))) / n);
  perm.push(second);
  const third = k - Math.pow(n, r - 1) * (first - 1) - n * (second - 1);
  perm.push(third);
  return perm;
};

app.get(/\/.*/, function (req, res, next) {
    
    let response = {};
    const path = req.path.slice(1);
    const re = /^(https?:\/\/)?([^\/]+\.[^\.\/]+)(\/.+)?/;
    const host = (req.path.slice(1).match(re))[2] || null;
    dns.lookup(host, (err, address, family) => {
        console.log(address);
        if (address) {
            response.original_url = req.path.slice(1);
            const shorturl = findPerm(226920).map(function(ix) {
                return str[ix - 1];
            }).join('');
            response.shortened_url = req.protocol + '://' + req.get('host') + '/' + shorturl;
            
            // res.status(302)
            // res.location('http://www.google.com')
            // res.end()
            res.send(response)
        } else {
            res.send('not a valid url')
        }
    })
});

app.listen(port);