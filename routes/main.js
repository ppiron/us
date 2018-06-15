const router = require('express').Router();
const dns = require('dns');
const findPerm = require('../findPerm.js');
const database = require('../datatabase.js');
const db = database.getDb();

function handleURL(req, res) {
  let str = 'abcdefghijklmnopqrstuvwxyz';
  str = str + str.toUpperCase();
  str = str + '0123456789';

  let response = {};

  const url = req.path.slice(1);
  const re = /^(https?:\/\/)?([^\/]+\.[^\.\/]+)(\/.+)?/;
  const host = url.match(re) ? (url.match(re))[2] : null;

  dns.lookup(host, (err, address, family) => {
    console.log(address);
    if (address) {
      db.collection('urls').find({ url: url }, (error, result) => {
        if (error) {
          console.log(error);
        } else {
          result.count()
            .then((count) => {
              console.log(count);
              if (count === 0) {
                // url is not in the db => create new entry in the db
                let nextIndex
                db.collection('urls').find({}, { _id: 0, id: 1 }, (error, result) => {
                  if (error) {
                    console.log(error)
                    return
                  }
                  result.toArray()
                  .then((data) => {
                    console.log(data.length)
                    nextIndex = (data.length > 0) ? (data.slice(-1)[0].id + 1) : 1;
                    const shorturl = findPerm(nextIndex).map(function (ix) {
                      return str[ix - 1];
                    }).join('');
                    db.collection('urls').insertOne({ id: nextIndex, url: url, shorturl: shorturl }, (error, result) => {
                      if (error) {
                        console.log(error);
                        return
                      }
                      console.log(result.ops[0]);
                    })
                    response.original_url = url;
                    response.shortened_url = req.protocol + '://' + req.get('host') + '/' + shorturl;
                    res.send(response)
                  })
                })
              } else {
                // url is already in the db
                result.toArray()
                  .then((data) => {
                    console.log(data[0]['url'])
                    response.original_url = data[0]['url'];
                    response.shortened_url = req.protocol + '://' + req.get('host') + '/' + data[0]['shorturl'];
                    res.send(response)
                  });
              }
            });
        }
      })
    } else {
      res.json({error: 'Not a valid url'})
    }
  })
}

router.get(/\/.*/, handleURL);

module.exports = router;