const validMethods = ['get','patch','put','post','delete','update'];

function request(url,method='get',options={}) {
  if (typeof url != 'string' || url.length < 1) throw new Error('Invalid URL');
  if (typeof method != 'string' || method.length < 1 || !validMethods.includes(method)) throw new Error('Invalid Method');
  if (typeof options != 'object') throw new Error('Invalid Options');
  if (options.auth !== null && (typeof options.auth !=='string' || options.auth.length > 0) && (typeof options.auth !== 'object' || !Array.isArray(options.auth))) throw new Error('Invalid Auth');
  if (typeof options.auth == 'string') options.auth = [options.auth];

  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    if (options.auth) xhr.setRequestHeader('Authorization','Basic '+btoa(options.auth.join(':')));
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: xhr.status,
        statusText: xhr.statusText
      });
    };
    xhr.send();
  });
}
export default request;
