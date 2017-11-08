const {Session} = require('../models');

function getSession(user){
  return new Promise((resolve,reject)=>{
    Session.findOne({owner:user.username},(err,session)=>{
      if (err){
        reject(err);
        return;
      }
      if (session) {
        resolve(session);
      }
      let newSession = new Session({owner:user.username});
      newSession.save((err,session)=>{
        if (err){
          reject(err);
          return;
        }
        resolve(session);
      });
    });
  });
}
module.exports = getSession;
