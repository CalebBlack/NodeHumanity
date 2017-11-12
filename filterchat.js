const anchorme = require('anchorme').default;
module.exports = function filterChat(message){
  if (message.includes('href=')) return false;
  let detect = anchorme(message,{list:true});
  if (detect.length > 0) return true;
  return false;
}
