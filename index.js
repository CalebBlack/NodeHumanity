const app = require('./app');
const stringToInt = require('./functions/stringtoint');

const port = process.argv[2] ? stringToInt(process.argv[2]) : null;

if (port === null) {
  throw new Error('Cannot Start, Invalid or Missing Port Argument.');
}

try {
  const cards = require('./public/cards.json');
} catch (error) {
  throw new Error('Cannot Start, Missing Card List');
}

app.listen(port,err=>{
  if (err) throw err;
  console.log(`Server Running on Port ${port}.`);
});
