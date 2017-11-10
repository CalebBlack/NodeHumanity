// CREATE SECURE ENDPOINTS
const express = require('express');
const authenticateSession = require('./functions/authenticatesession');
const secureMap = require('./secureroutes/map');

const secureRoutes = express.Router();

secure.use((req,res,next)=>{
  authenticateSession(req).then(session=>{
    console.log({session});
    res.locals.session = session;
    next();
  }).catch(err=>{
    res.status(400).send('Unauthorized');
  });
});

secureMap.forEach(route=>{secureRoutes[route[1]](route[2],route[0])});

module.exports = secureRoutes;
