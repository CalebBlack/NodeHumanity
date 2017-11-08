const validPasswordCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRTSUVWXYZ0123456789!@#$%^&*-+_=.,?'

function username(username) {
  return (typeof username == 'string' && username.length > 0 && !username.includes(' '));
}
function password(password) {
  if (typeof password == 'string' && password.length > 7) {
    for (var char in password) {
      if (!validPasswordCharacters.includes(char)) return false;
    }
    return true;
  } else {
    return false;
  }
}
module.exports = {username,password};
