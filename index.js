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
const LEX = require('letsencrypt-express');

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
  let lex = LEX.create({server:'staging',email:'sxuanchonline@gmail.com',agreeTos:true,approveDomains:['sxuan.ch','www.sxuan.ch']});
  let server = http.createServer(lex.middleware(require('redirect-https')()));
  let secureServer = https.createServer(lex.httpsOptions,lex.middleware(app))
  sockets(secureServer);
  console.log('Running Servers');
  server.listen(80);
  secureServer.listen(443)
}
