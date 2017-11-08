const express = require('express');
const Isemail = require('isemail');
const bcrypt = require('bcrypt');

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
              displayname: auth[0],
              username: auth[0],
              email: req.body.email
            };
            bcrypt.hash(auth[0], 10, function(err, hash) {
              if (err) return res.status(500).send();
              userData.hash = hash;
              var userEntry = new User(userData);
              userEntry.save((err,user)=>{
                if (err) return res.status(500).send();
                res.status(200).send('User Created');
              })
            });
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
