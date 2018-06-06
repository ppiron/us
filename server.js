const http = require('http')
const app = require('./app')
const database = require('./datatabase.js');
const port = process.env.PORT || 3000;

const server = http.createServer(app);

database.connect( (err) => {
  if (err) {
    console.log(err);
    return
  }
  server.listen(port)
})

