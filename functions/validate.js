function username(username) {
  return (typeof username == 'string' && username.length > 0 && !username.includes(' '));
}
module.exports = {username};
