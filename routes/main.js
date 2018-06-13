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
          db.collection('urls').find( {url: url}, (error, result) => {
              if (error) {
                  console.log(error);
                  // res.status(302)
                  // res.location('http://www.google.com')
                  // res.end()
                } else {
                    result.count()
                    .then( (count) => {
                        console.log(count);
                        if (count === 0) {
                            const shorturl = findPerm(226920).map(function(ix) {
                                return str[ix - 1];
                            }).join('');
                            db.collection('urls').insertOne( {id: 226920, url: url, shorturl: shorturl}, (error, result) => {
                                if (error) {
                                    console.log(error);
                                    return
                                }
                                console.log(result.ops[0]);
                            })
                            response.original_url = url;
                            response.shortened_url = req.protocol + '://' + req.get('host') + '/' + shorturl;
                            res.send(response)                            
                        }
                    });
              }
          })
      } else {
          res.send('not a valid url')
      }
  })
}

router.get(/\/.*/, handleURL);

module.exports = router;