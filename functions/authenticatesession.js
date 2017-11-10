const {Session} = require('../models');
function authenticateSession(sessionID){
  return new Promise((resolve,reject)=>{
    Session.find({_id:sessionID},(err,session)=>{
      if (err) return reject(err);
      if (!session) return reject(null);
      resolve(session);
    });
  });
}
