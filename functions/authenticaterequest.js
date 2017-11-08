const bcrypt = require('bcrypt');
const {User} = require('../models');
const decodeAuthHeaders = require('./decodeauthheaders');
function authenticateRequest(req){
  return new Promise((resolve,reject)=>{
    auth = decodeAuthHeaders(req);
    if (auth && auth.length == 2) {
      User.findOne({username:auth[0]},(err,user)=>{
        if (err) reject(err);
        bcrypt.compare(auth[0], user.hash, function(err, res) {
          if (err || res !== true) reject(err);
          resolve(user);
        });
      })
    }
  });
}
module.exports = authenticateRequest;
