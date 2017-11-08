var express = require('express');
const {User} = require('./models');
const authenticaterequest = require('./functions/authenticaterequest');

const api = express.Router();


// define the home page route
api.get('/',(req, res)=>{
  res.status(200).send('Cards Against Humanity API');
});
// define the about route
api.post('/createuser', (req, res)=>{

});
api.get('/login',(req,res)=>{
  const user = authenticaterequest(req);
  if (user) {
    res.status(200).send('Authorized');
  } else {
    res.status(401).send('Unauthorized');
  }
});

module.exports = api
