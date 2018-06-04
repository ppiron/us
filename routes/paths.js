const router = require('express').Router();
const dns = require('dns');
const findPerm = require('../findPerm.js');

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
}

router.get(/\/.*/, handleURL);

module.exports = router;