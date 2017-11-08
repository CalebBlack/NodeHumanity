const express = require('express');
const bodyParser = require('body-parser')

const app = express();
const api = require('./api');

app.use(bodyParser.json());

app.use(express.static('public'));
app.use(express.static('build'));
app.use(express.static('resources'));

// PUT ROUTES BELOW HERE
app.use('/api',api);
//

app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`))

module.exports = app;
