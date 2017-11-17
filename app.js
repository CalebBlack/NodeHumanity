const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
//const enforce = require('express-sslify');

const api = require('./api');
const {sockets} = require('./sockets');

const app = express();

// EXPRESS CONFIG
app.disable('x-powered-by');

// MIDDLEWARE
//app.use(enforce.HTTPS());
app.use(compression());
app.use(bodyParser.json());
app.use(helmet());
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));

// CUSTOM MIDDLEWARE
app.use(function(err, req, res, next) {
  console.error('err',err);
  res.status(500).send('Error');
});

// LOCAL FILES
app.use(express.static('public'));
app.use(express.static('build'));
app.use(express.static('resources'));

// ROUTING
app.use('/api',api);

// OTHER
app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`));
sockets(server);

module.exports = server;
