const validPasswordCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRTSUVWXYZ0123456789!@#$%^&*-+_=.,?'

function username(username) {
  if (typeof username == 'string') {
    if (username.length > 0) {
      if (!username.includes(' ')) {
        return true;
      } else {
        return 'Contains Space'
      }
    } else {
      return ('Empty')
    }
  } else {
    return 'Not String'
  }
}
function password(password) {
  if (typeof password == 'string') {
    if (password.length > 7) {
      for (var char in password) {
        if (!validPasswordCharacters.includes(char)) return 'Invalid Character';
      }
      return true;
    } else {
      return 'Too Short';
    }
  } else {
    return 'Not String';
  }
}
module.exports = {username,password};
