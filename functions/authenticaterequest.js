const {User} = require('../models');
function authenticaterequest(req){
  if (req.headers.authorization) {
    var auth = req.headers.authorization;
    if (auth.startsWith('Basic ') && auth.length > 6) {
      auth = Buffer.from(b64string, 'base64').toString().split(':');
      if (auth.length == 2) {
        User.findOne({username:auth[0]},(err,user)=>{
          if (err) return null;
          bcrypt.compare(auth[0], user.hash, function(err, res) {
            if (err || res !== true) return null;
            return user;
          });
        })
      } else {
        return null;
      }
    } else {
      return null;
    }
  } else {
    return null;
  }
}
module.exports = authenticaterequest;
