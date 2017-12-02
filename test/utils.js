// Utility Functions for Tests
const letters = 'abcdefghijklmnopqrstuvwxyz';

function randomInt(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}
function randomLetters(length=1){
  output = '';
  for (var i = 0; i < length; i++) {
    output += letters[randomInt(0,letters.length - 1)];
  }
  return output;
}

module.exports = {letters,randomInt,randomLetters};
