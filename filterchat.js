const anchorme = require('anchorme').default;
const bannedWords = require('./bannedwords.json');
const letters = []
module.exports = function filterChat(message){
  var lowercase = message.toLowerCase();
  var nospace = lowercase.replace(/ /g,'');
  var lettersonly = nospace.replace(/[^a-z]/gi,'');
  for (var i = 0; i < bannedWords.length; i++) {
    if (lowercase.includes(bannedWords[i]) || nospace.includes(bannedWords[i]) || lettersonly.includes(bannedWords[i])) return true;
  }
  let detect = anchorme(message,{list:true});
  if (detect.length > 0) return true;
  return false;
}
