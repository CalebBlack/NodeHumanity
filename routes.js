const express = require('express');
const routeMap = require('./routes/map');

const routes = express.Router();

routeMap.forEach(route=>{secure[route[1]](route[2],route[0])});

module.exports = routes;
