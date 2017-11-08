var mongoose = require('mongoose');
const schemaMap = require('./schemas/map');
mongoose.connect('mongodb://localhost/cardsagainsthumanity', { useMongoClient: true });
mongoose.Promise = global.Promise;

var output = {};
Object.entries(schemaMap).forEach((pair)=>{
  let name = pair[0].charAt(0).toUpperCase() + pair[0].slice(1);
  output[name] = mongoose.model(name, pair[1]);
});
module.exports = output;
