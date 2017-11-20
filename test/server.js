const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const api = require('../api');

const expect = chai.expect;

chai.use(chaiHttp);

// TESTING UTILITY FUNCTIONS
function randomInt(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}
const letters = 'abcdefghijklmnopqrstuvwxyz';
function randomLetters(length=1){
  output = '';
  for (var i = 0; i < length; i++) {
    output += letters[randomInt(0,letters.length - 1)];
  }
  return output;
}
// END TESTING UTILITY FUNCTIONS

// BEGIN TESTING

describe('Static Resources', function() {
  // TEST CARDS AVAILABILITY
  describe('/cards.json', function() {
    it('responds with status 200', function(done) {
      chai.request(app).get('/cards.json').end(function(err, res) {
        expect(res).to.have.status(200);
        done();
      });
    });
    it('responds with JSON data', function(done) {
      chai.request(app).get('/cards.json').end(function(err, res) {
        expect(res).to.be.json;
        done();
      });
    });
  });
});
describe('Rest API',function(){
  describe('Signup Route',function(){
    it('rejects empty requests',function(done){
      chai.request(app).post('/api/signup').end(function(err, res) {
        expect(res).to.have.status(400);
        done();
      });
    });
    it('allows requests with valid user details',function(done){
      chai.request(app).post('/api/signup').auth(randomLetters(10),randomLetters(10)).send({email:randomLetters(5)+'@gmail.com'}).end(function(err,res){
        expect(res).to.have.status(200);
        done();
      });
    });
  });
});
