const bcrypt = require('bcrypt');
const {User} = require('../models');
const decodeAuthHeaders = require('./decodeauthheaders');
function authenticateRequest(req){
  return new Promise((resolve,reject)=>{
    auth = decodeAuthHeaders(req);
    if (auth && auth.length == 2) {
      User.findOne({username:auth[0]},(err,user)=>{
        if (err) return reject(err);
        if (!user) return reject('banned');
        if (user.banned === true) return reject();
        console.log(auth[0]);
        bcrypt.compare(auth[1], user.hash, function(err, res) {
          console.log('passed hash',res);
          if (err || res !== true) reject(err);
          resolve(user);
        });
      })
    } else {
      reject('invalid auth');
    }
  });
}
module.exports = authenticateRequest;
