const bcrypt = require('bcrypt');
const {User} = require('../models');
const decodeAuthHeaders = require('./decodeauthheaders');
function authenticateRequest(req){
  auth = decodeAuthHeaders(req);
  if (auth && auth.length == 2) {
    User.findOne({username:auth[0]},(err,user)=>{
      if (err) return null;
      bcrypt.compare(auth[0], user.hash, function(err, res) {
        if (err || res !== true) return null;
        return user;
      });
    })
  }
}
module.exports = authenticaterequest;
