const {Session} = require('../models');

function getSession(username){
  Session.find({owner:username.toLowerCase()});
}
