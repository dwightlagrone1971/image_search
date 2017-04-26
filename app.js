var express = require('express');
var path = require('path');
var routes = require('./routes')
var mongo = require('mongodb');

var port = process.env.PORT || 8080;
var app = express(); 

var monLab = "mongodb://dlagrone01:bear1971@ds159050.mlab.com:59050/shortner";

mongo.connect(monLab, function(err, db) {
  
  if(err) {
    console.log("Connection was NOT successful!!!");
  } else {
    console.log("Connect to database was successful!");
  }
  
  app.use(express.static(path.join(__dirname, 'public')));
  app.set('view engine', 'jade');
  
  app.get('/', routes.home);
  
  app.get('/search', routes.search);
  
  app.get('/latest', routes.latest);
  
}); // end of mongo connection function

app.listen(port, function() {
    console.log("Server has started on port: " + port + ".....");
});