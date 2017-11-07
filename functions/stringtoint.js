function stringToInt(string) {
  try {
    return parseInt(string);
  } catch(error) {
    return null;
  }
}
module.exports = stringToInt;
