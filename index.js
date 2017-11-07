const app = require('./app');
const stringToInt = require('./functions/stringtoint');

const port = process.argv[2] ? stringToInt(process.argv[2]) : null;

if (port === null) {
  throw new Error('Cannot Start, Invalid or Missing Port Argument.');
}

app.start(port);
