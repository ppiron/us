const express = require('express');
const app = express();
const port = process.env.port || 3000;

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
    
    console.log(req.get('host'));
    let response = {};
    const path = req.path.slice(1);
    console.log(req.path.slice(1).match(/^http[s?]:\/\/[^\/].+\.+/))
    if (req.path.slice(1).match(/^http[s?]:\/\/[^\/].+\.+/)) {
        response.original_url = req.path.slice(1);
        const shorturl = findPerm(10).map(function(ix) {
            return str[ix];
        }).join('');
        response.shortened_url = req.protocol + '://' + req.get('host') + '/' + shorturl;
        
        // res.status(302)
        // res.location('http://www.google.com')
        // res.end()
        res.send(response)
    } else {
        res.send('not a valid url')
    }
});

app.listen(port);