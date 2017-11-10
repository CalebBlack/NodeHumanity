const validMethods = ['get','patch','put','post','delete','update'];

function request(url,method='get',options={}) {
  if (typeof url != 'string' || url.length < 1) throw new Error('Request: Invalid URL');
  if (typeof method != 'string' || method.length < 1 || !validMethods.includes(method)) throw new Error('Request: Invalid Method');
  if (typeof options != 'object') throw new Error('Invalid Options');
  //if (options.auth !== null && (typeof options.auth !=='string' || options.auth.length > 0) && (typeof options.auth !== 'object' || !Array.isArray(options.auth))) throw new Error('Invalid Auth');
  if (options.auth !== null && options.auth !== undefined) {
    if (typeof options.auth === 'string') {
      options.auth = [options.auth];
    } else if (typeof options.auth !== 'object' || !Array.isArray(options.auth)) {
      throw new Error('Request: Invalid Auth Formatting');
    }
  }
  if (options.secure === true && localStorage.sessionID) {
    options.headers = Object.assign(options.headers || {},{session:localStorage.sessionID});
  }
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    if (options.auth) xhr.setRequestHeader('Authorization','Basic '+btoa(options.auth.join(':')));
    if (options.headers) {
      Object.entries(options.headers).forEach(pair=>{
        xhr.setRequestHeader(pair[0],pair[1]);
      })
    }
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status <= 304) {
        resolve(xhr.response);
      } else {
        reject({
          status: xhr.status,
          statusText: xhr.statusText
        });
      }
    }
    xhr.onerror = function () {
      reject({
        status: xhr.status,
        statusText: xhr.statusText
      });
    };
    if (options.body) {
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.send(JSON.stringify(options.body));
    } else {
      xhr.send();
    }
  });
}
export default request;
