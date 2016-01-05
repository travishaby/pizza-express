const express = require('express');
const app = express();

const path = require('path');
const bodyParser = require('body-parser');

const generateId = require('./lib/generate-id');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('static'));

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');
app.locals.title = 'Pizza Express';
app.locals.pizzas = {};

app.get('/', function(request, response){
  response.render('index');
});

app.post('/pizzas', function(request, response){
  var id = generateId();
  app.locals.pizzas[id] = request.body;

  response.sendStatus(201);
});

if (!module.parent) {
  app.listen(app.get('port'), function(){
    console.log(app.locals.title + ' is running on ' + app.get("port") + '.');
  });
}

module.exports = app;
