var express = require('express');
const {User} = require('./models');

const api = express.Router();


// define the home page route
api.get('/',(req, res)=>{
  res.status(200).send('Cards Against Humanity API');
});
// define the about route
api.post('/createuser', (req, res)=>{

});
api.get('/login',(req,res)=>{
  if (req.headers.authorization) {
    console.log(req.headers.authorization);
    res.status(200).send("Authorized");
  } else {
    res.status(401).send('Unauthorized');
  }
});

module.exports = api
