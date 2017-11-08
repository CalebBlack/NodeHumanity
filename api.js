var express = require('express')
const api = express.Router()


// define the home page route
api.get('/',(req, res)=>{
  res.status(200).send('Cards Against Humanity API');
});
// define the about route
api.get('/about', (req, res)=>{
  res.send('About birds')
});
api.get('/login',(req,res)=>{
  res.status(400).send('error');
});

module.exports = api
