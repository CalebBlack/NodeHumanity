// CREATE SECURE ENDPOINTS
const express = require('express');
const authenticateSession = require('./functions/authenticatesession');
const secureRoutes = require('./secureroutes/map');

const secure = express.Router();

secure.use((req,res,next)=>{
  authenticateSession(req).then(session=>{
    res.locals.session = session;
    next();
  }).catch(err=>{
    req.status(400).send('Unauthorized');
  });
});

secureRoutes.forEach(route=>{secure[route[1]](route[0],route[2])});

module.exports = secure;
