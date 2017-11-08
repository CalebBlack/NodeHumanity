const express = require('express');
const Isemail = require('isemail');

const {
  User
} = require('./models');
const validate = require('./functions/validate');
const authenticateRequest = require('./functions/authenticaterequest');
const decodeAuthHeaders = require('./functions/decodeauthheaders');

const api = express.Router();


// define the home page route
api.get('/', (req, res) => {
  res.status(200).send('Cards Against Humanity API');
});
// define the about route
api.post('/createuser', (req, res) => {
  auth = decodeAuthHeaders(req);
  if (auth && auth.length == 2) {
    if (validate.username(auth[0]) && validate.password(auth[1])) {
      if (req.body) {
        if (req.body.email) {
          if (typeof req.body.email == 'string' && Isemail.validate(req.body.email)) {
            var userData = {
              username: auth[0],
              email: req.body.email
            };
            
          } else {
            res.status(400).send('Malformed Email');
          }
        } else {
          res.status(400).send('Missing Email');
        }
      } else {
        res.status(400).send('Missing Body');
      }
    } else {
      res.status(400).send('Invalid Username or Password');
    }
  } else {
    res.status(400).send('Invalid Authorization Headers');
  }
});
api.get('/login', (req, res) => {
  const user = authenticateRequest(req);
  if (user) {
    res.status(200).send('Authorized');
  } else {
    res.status(401).send('Unauthorized');
  }
});

module.exports = api
