const express = require('express');
const Isemail = require('isemail');
const bcrypt = require('bcrypt');

const {
  User, Session
} = require('./models');
const validate = require('./functions/validate');
const authenticateRequest = require('./functions/authenticaterequest');
const authenticateSession = require('./functions/authenticatesession');
const decodeAuthHeaders = require('./functions/decodeauthheaders');
const getSession = require('./functions/getsession');
const routes = require('./routes');
const secureRoutes = require('./secureroutes');

const api = express.Router();


// define the home page route
api.get('/', (req, res) => {
  res.status(200).send('Cards Against Humanity API');
});
// define the about route
api.post('/signup', (req, res) => {
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
                var userOut = {username:user.username,displayname:user.displayname};
                getSession(user).then(session=>{
                  console.log('session',session);
                  let sessionOut = {id:session._id,created:session.createdAt};
                  return res.status(200).json({user:userOut,session:sessionOut});
                }).catch(err=>{
                  console.log('err',err);
                  return res.status(200).json({user:userOut,session:'error'});
                });
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
  authenticateRequest(req).then(user=>{
    getSession(user).then(session=>{
      var userOut = {username:user.username,displayname:user.displayname};
      let sessionOut = {id:session._id,created:session.createdAt};
      res.status(200).json({session:sessionOut,user:userOut});
    }).catch(err=>{
      res.status(500).send('Internal Error');
    });
  }).catch(err=>{
    res.status(401).send('Unauthorized');
  });
});

api.get('/logout',(req,res)=>{
  authenticateSession(req).then(session=>{
    session.remove(err=>{
      if (err) return res.status(500).send('error');
      res.status(200).send('Logout Successful');
    });
  }).catch(err=>{
    res.status(401).send('Unauthorized');
  });
});
// END OF AUTH ROUTES
// ENABLE ROUTERS
api.use(routes);
api.use(secureRoutes);

module.exports = api;
