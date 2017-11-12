const anchorme = require('anchorme').default;
const bannedWords = require('./bannedwords.json');
module.exports = function filterChat(message){
  for (var i = 0; i < bannedWords.length; i++) {
    if (message.includes(bannedWords[i])) return true;
  }
  let detect = anchorme(message,{list:true});
  if (detect.length > 0) return true;
  return false;
}
