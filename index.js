const app = require('./app');
const stringToInt = require('./functions/stringtoint');
const fs = require('fs');

const port = process.argv[2] ? stringToInt(process.argv[2]) : 8080;

if (port === null) {
  throw new Error('Invalid Port Argument.');
}


if (!fs.existsSync('./build/source.js')) throw new Error('Source Not Built! Type "npm run build"');


try {
  const cards = require('./public/cards.json');
} catch (error) {
  throw new Error('Cannot Start, Missing/Invalid Card List');
}

app.listen(port,err=>{
  if (err) throw err;
  console.log(`Server Running on Port ${port}.`);
});
