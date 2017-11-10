const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const api = require('./api');
const secure = require('./secure');
const routes = require('./routes/map');

const app = express();

// EXPRESS CONFIG
app.disable('x-powered-by');

// MIDDLEWARE
app.use(bodyParser.json());
app.use(helmet());
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));

// CUSTOM MIDDLEWARE
app.use(function(err, req, res, next) {
  console.error(err);
  res.status(500).send('Error');
});

// LOCAL FILES
app.use(express.static('public'));
app.use(express.static('build'));
app.use(express.static('resources'));

// ROUTES
app.use('/api',api);
app.use(secure);
routes.forEach(route=>{app[route[1]](route[0],route[2])});

// OTHER
app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`))

module.exports = app;
