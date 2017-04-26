var express = require('express');
var bodyParser = require('body-parser');
var imgur = require('imgur');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

exports.home = function(req, res) {
  
  res.render('home');
};

exports.search = function(req, res) {
  
  var input = document.getElementById('#searchBar');
  
  
  res.send('input');
  
};

exports.latest = function(req, res) {
  res.render('latest');
};

