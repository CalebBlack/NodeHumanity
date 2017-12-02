const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

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

// TEST RESOURCE AVAILABILITY
describe('Static Resources', function() {
  describe('index.html',function(){
    it ('responds with status 200',function(done){
      chai.request(app).get('/index.html').end(function(err, res) {
        expect(res).to.have.status(200);
        done();
      });
    });
    it ('response is html',function(done){
      chai.request(app).get('/index.html').end(function(err, res) {
        expect(res).to.be.html;
        done();
      });
    });
  });
  describe('source.js',function(){
    it ('responds with status 200',function(done){
      chai.request(app).get('/source.js').end(function(err, res) {
        expect(res).to.have.status(200);
        done();
      });
    });
    it ('content-type is UTF-8 encoded Javascript',function(done){
      chai.request(app).get('/source.js').end(function(err, res) {
        expect(res).to.have.header('content-type', 'application/javascript; charset=UTF-8');
        done();
      });
    });
  });
  describe('cards.json', function() {
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
// TEST REST ENDPOINTS
describe('Rest API',function(){
  // GENERATE RANDOM CREDENTIALS TO TEST WITH
  let testUser = {username:randomLetters(10),password:randomLetters(10),email:randomLetters(5)+'@sxuan.ch'}
  var session;
  // TEST SIGNUP
  describe('Signup',function(){
    it('rejects empty requests',function(done){
      chai.request(app).post('/api/signup').end(function(err, res) {
        expect(res).to.have.status(400);
        done();
      });
    });
    it('allows requests with valid user details',function(done){
      chai.request(app).post('/api/signup').auth(testUser.username,testUser.password).send({email:testUser.email}).end(function(err,res){
        session = res.body.session.id;
        expect(res).to.have.status(200);
        done();
      });
    });
  });
  // TEST AUTH VALIDATE ROUTE
  describe('Validate Auth',function(){
    it('rejects empty requests',function(done){
      chai.request(app).get('/api/validateauth').end(function(err, res) {
        expect(res).to.have.status(400);
        done();
      });
    });
    it('rejects invalid sessions',function(done){
      chai.request(app).get('/api/validateauth').set('session','iliveunderarockpleasehelp').end(function(err,res){
        expect(res).to.have.status(400);
        done();
      });
    });
    it('accepts signup session',function(done){
      chai.request(app).get('/api/validateauth').set('session',session).end(function(err,res){
        expect(res).to.have.status(200);
        done();
      });
    });
  });
  // TEST LOGIN ROUTE
  describe('Login',function(){
    it('rejects empty requests',function(done){
      chai.request(app).get('/api/login').end(function(err, res) {
        expect(res).to.have.status(401);
        done();
      });
    });
    it('accepts credentials from signup',function(done){
      chai.request(app).get('/api/login').auth(testUser.username,testUser.password).end(function(err, res) {
        expect(res).to.have.status(200);
        done();
      });
    });
  });
  // TEST LOGOUT ROUTE
  describe('Logout',function(){
    it('rejects empty requests',function(done){
      chai.request(app).get('/api/logout').end(function(err, res) {
        expect(res).to.have.status(401);
        done();
      });
    });
    it ('accepts signup session',function(done){
      chai.request(app).get('/api/logout').set('session',session).end(function(err,res){
        expect(res).to.have.status(200);
        done();
      });
    });
    it ('invalidates signup session',function(done){
      chai.request(app).get('/api/validateauth').set('session',session).end(function(err,res){
        expect(res).to.have.status(400);
        done();
      });
    });
  });
});
