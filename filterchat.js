const anchorme = require('anchorme').default;
const bannedWords = require('./bannedwords.json');
module.exports = function filterChat(message){
  var lowercase = message.toLowerCase();
  var nospace = lowercase.replace(' ','');
  for (var i = 0; i < bannedWords.length; i++) {
    if (nospace.includes(bannedWords[i])) return true;
  }
  let detect = anchorme(message,{list:true});
  if (detect.length > 0) return true;
  return false;
}
