var express = require('express');
const {User} = require('./models');
const authenticateRequest = require('./functions/authenticaterequest');
const decodeAuthHeaders = require('./functions/decodeauthheaders');

const api = express.Router();


// define the home page route
api.get('/',(req, res)=>{
  res.status(200).send('Cards Against Humanity API');
});
// define the about route
api.post('/createuser', (req, res)=>{
  auth = decodeAuthHeaders(req);
  if (auth && auth.length == 2) {
  } else {
    res.status(412).send('Invalid Authorization Headers');
  }
});
api.get('/login',(req,res)=>{
  const user = authenticateRequest(req);
  if (user) {
    res.status(200).send('Authorized');
  } else {
    res.status(401).send('Unauthorized');
  }
});

module.exports = api
