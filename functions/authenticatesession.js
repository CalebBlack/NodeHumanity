const {Session} = require('../models');
function authenticateSession(req){
  return new Promise((resolve,reject)=>{
    if (req.headers && req.headers.session && typeof req.headers.session == 'string' && req.headers.session.length > 0) {
      Session.findOne({_id:req.headers.session},(err,session)=>{
        if (err) return reject(err);
        if (!session) return reject(null);
        resolve(session);
      });
    } else {
      reject('Unauthorized');
    }
  });
}
module.exports = authenticateSession;
