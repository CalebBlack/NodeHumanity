function decodeAuthHeaders(req) {
  if (req.headers.authorization) {
    var auth = req.headers.authorization;
    if (auth.startsWith('Basic ') && auth.length > 6) {
      return Buffer.from(b64string, 'base64').toString().split(':');
    } else {
      return null;
    }
  } else {
    return null;
  }
}
module.exports = decodeAuthHeaders;
