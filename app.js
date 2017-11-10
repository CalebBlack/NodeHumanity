const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const app = express();
const api = require('./api');

app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(helmet());
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));

app.use(function(err, req, res, next) {
  console.error(err);
  res.status(500).send('Error');
});

app.use(express.static('public'));
app.use(express.static('build'));
app.use(express.static('resources'));

// PUT ROUTES BELOW HERE
app.use('/api',api);
//

app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`))

module.exports = app;
