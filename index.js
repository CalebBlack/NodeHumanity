try {
  const cards = require('./public/cards.json');
} catch (error) {
  throw new Error('Cannot Start, Missing/Invalid Card List');
}

const app = require('./app');
const {sockets} = require('./sockets');
const stringToInt = require('./functions/stringtoint');
const fs = require('fs');
const http = require('http');
const https = require('https');
const letsEncrypt = require('letsencrypt-express')

const port = process.argv[2] ? stringToInt(process.argv[2]) : null;

// if (port === null) {
//   throw new Error('Invalid Port Argument.');
// }
const httpServer = http.Server(app);
sockets(httpServer);


if (!fs.existsSync('./build/source.js')) throw new Error('Source Not Built! Type "npm run build"');


if (port) {
  httpServer.listen(port);
  console.log(`Server Running on Port ${port}.`);
} else {
  let server = letsEncrypt.create({server:'production',email:'lily@lillith.pw',agreeTos:true,approveDomains:['sxuan.ch','www.sxuan.ch'],app});
  console.log('Running Encrypted Server');
  server.listen(80,443);
}
