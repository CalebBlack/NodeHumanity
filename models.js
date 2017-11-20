var mongoose = require('mongoose');
const schemaMap = require('./schemas/map');
const config = require('./config');
const defaultConfig = {address:'localhost',port:'27017',database:'cardsagainsthumanity'}
const mongooseConfig = config.mongoose ? Object.assign(defaultConfig,config.mongoose) : defaultConfig;

mongoose.connect('mongodb://'+mongooseConfig.address+':'+mongooseConfig.port+'/'+mongooseConfig.database, { useMongoClient: true }, function(err) {
    if (err) throw err;
});
mongoose.Promise = global.Promise;

var output = {};
Object.entries(schemaMap).forEach((pair)=>{
  let name = pair[0].charAt(0).toUpperCase() + pair[0].slice(1);
  output[name] = mongoose.model(name, pair[1]);
});
module.exports = output;
