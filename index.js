try {
  const cards = require('./public/cards.json');
} catch (error) {
  throw new Error('Cannot Start, Missing/Invalid Card List');
}

const app = require('./app');
const stringToInt = require('./functions/stringtoint');
const fs = require('fs');
const http = require('http');

const port = process.argv[2] ? stringToInt(process.argv[2]) : null;

// if (port === null) {
//   throw new Error('Invalid Port Argument.');
// }


if (!fs.existsSync('./build/source.js')) throw new Error('Source Not Built! Type "npm run build"');


if (port) {
  app.listen(port,err=>{
    if (err) throw err;
    console.log(`Server Running on Port ${port}.`);
  });
} else {
  if (fs.existsSync('sslcert/server.key') && fs.existsSync('sslcert/server.crt')) {
    var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
    var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
    var credentials = {key: privateKey, cert: certificate};
    var httpServer = http.createServer(app);
    var httpsServer = https.createServer(credentials, app);
    console.log('Launching Secure and Insecure HTTP servers');
    httpServer.listen(80);
    httpsServer.listen(443);
  } else {
    app.listen(80,err=>{
      if (err) throw err;
      console.log(`Server Running on Port 80.`);
    });
  }
}
