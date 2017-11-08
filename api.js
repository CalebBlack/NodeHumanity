var express = require('express')
const api = express.Router()


// define the home page route
api.get('/', function (req, res) {
  res.status(200).send('Cards Against Humanity API');
});
// define the about route
api.get('/about', function (req, res) {
  res.send('About birds')
})

module.exports = api
