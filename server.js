const http = require('http')
const database = require('./datatabase.js');
const port = process.env.PORT || 3000;


database.connect( (err) => {
  if (err) {
    console.log(err);
    return
  }
  const app = require('./app')
  const server = http.createServer(app);
  server.listen(port)
})

