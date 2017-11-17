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
const letsEncrypt = require('letsencrypt-express').testing();

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
  let lex = letsEncrypt.create({server:'staging',email:'lily@lillith.pw',agreeTos:true,approveDomains:['sxuan.ch','www.sxuan.ch']});
  let responder = letsEncrypt.createAcmeResponder(lex, app);
  let secureServer = https.createServer(lex.httpsOptions, responder);
  let server = http.createServer(responder);
  socket(secureServer);
  console.log('Running Encrypted Server');
  server.listen(80,443);
}
