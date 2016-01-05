const assert = require('assert');
const request = require('request');
const app = require('../server');

const fixtures = require('./fixtures');

describe('Server', function() {

  before(function(done) {
    this.port = 9876;

    this.server = app.listen(this.port, function(error, result) {
    if (error) { return done(error); }
      done();
    });

    this.request = request.defaults({
      baseUrl: 'http://localhost:9876/'
    });
  });

  after(function() {
    this.server.close();
  });

  it('should exist', function() {
    assert(app);
  });

  describe('GET /', function(){
    it('should return a 200', function(done) {
      this.request.get('/', function(error, response) {
        if (error) { done(error); }
        assert.equal(response.statusCode, 200);
        done();
      });
    });

    it('should have a body with the name of the application', function(done) {
      var title = app.locals.title;

      this.request.get('/', function(error, response){
        if (error) { done(error); }
        assert(response.body.includes(title),
          response.body + ' does not include ' + title + ' .');
        done();
      });
    });

  });
  describe('POST /pizzas', function(){
    beforeEach(() => {
      app.locals.pizzas = {};
    });

    it('should receive and store data', function(done) {
      var payload = { pizza: fixtures.validPizza };

      this.request.post('/pizzas', { form: payload }, function(error, response){
        if (error) { done(error); }
        assert.notEqual(response.statusCode, 404);

        var pizzaCount = Object.keys(app.locals.pizzas).length;

        assert.equal(pizzaCount, 1, 'Expected 1 pizza, found ' + pizzaCount);
        done();
      });
    });

  });
  describe('GET /pizzas/:id', function() {
    beforeEach(function() {
      app.locals.pizzas.testPizza = fixtures.validPizza;
    });
    it('should not return 404', function(done) {
      this.request.get('/pizzas/testPizza', function(error, response) {
        if (error) { done(error); }
        assert.notEqual(response.statusCode, 404);
        done();
      });
    });
    it('should return a page that has the title of the pizza', function(done) {
      var pizza = app.locals.pizzas.testPizza;

      this.request.get('/pizzas/testPizza', function(error, response) {
        if (error) { done(error); }
        assert(response.body.includes(pizza.name),
          response.body + ' does not include ' + pizza.name + ' .');
        done();
      });
    });
    it('the toppings of a requested pizza displayed', function(done) {
      var pizza = app.locals.pizzas.testPizza;

      this.request.get('/pizzas/testPizza', function(error, response) {
        if (error) { done(error); }
        pizza.toppings.forEach(function(topping){
          assert(response.body.includes(topping),
            response.body + ' does not include ' + topping + ' .');
        });
        done();
      });
    });
  });
});
