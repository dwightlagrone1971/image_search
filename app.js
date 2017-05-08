var express = require('express');
var path = require('path');
var mongo = require('mongodb');
var imgur = require('imgur');
var https = require('https');

// set port
var port = process.env.PORT || 8080;
// set express variable
var app = express();
// set mongo database path
var monlab = "mongodb://dlagrone01:bear1971@ds159050.mlab.com:59050/shortner";
// connect to monlab
mongo.connect(monlab, function(err, db) {
    // check if connection was successfull
    if(err) {
        console.log("Connection was NOT successfull!!");
    } else {
        console.log("Connection to the database was successfull!!");
    }
    // set path to public folder
    app.use(express.static(path.join(__dirname, 'public')));
    // set view engine
    app.set('view engine', 'jade');
    // set route to home page
    app.get('/', function(req, res) {
        res.render('home');
    });
    // set route to search imgur url
    app.get('/search/:query', function(req, res) {
        
        /* sart: clear database
        db.collection('search', {}, function(err, search) {
            if (err) throw err;
            search.remove({}), function(err, results) {
                if (err) {
                    console.log(err);
                }
            };
        });
        // end: clear database */
        // start: assign variables for url inputs
        var query = req.params.query;
        var string = query.match('=([^;]*)&');
        var pagString = query.match(/\d+$/).toString();
        var pagNum = parseInt(pagString);
        console.log(query);
        console.log(pagNum);
        console.log(string[1]);
        // end: assign variables for url inputs
        // start: setup the connection properties for imgur
        var options = {
            hostname: 'api.imgur.com',
            path: '/3/gallery/search/?' + query,
            headers: {'Authorization': 'Client-ID f472a29449d911f'},
            method: 'GET'
        };
        // end: setup the connection properties for imgur
        // start: build image json file
        https.get(options, function(res) {
          var body = "";
          
          res.on('data', function(chunk) {
            body += chunk;
          });
          
          res.on('end', function() {
            var jsonObject = JSON.parse(body);
            console.log("Object was created successfully!!");
            saveObj(jsonObject);
          });
        }).on('error', function(e) {
          console.log("Got an error: ", e);
        });
        // end: build image json file
        // start: save object to database
        function saveObj(object) {
            var search = db.collection('search');
            search.insert(object.data);
            console.log("Object was saved successfully!!!");
            createHistory();
        }
        // end: save object to database
        // start: create history
        function createHistory() {
            var history = {
                'subject' : string[1],
                'date' : new Date().toString()
            };
            saveHistory(history);
        }
        // end: create history
        // start: save history
        function saveHistory(obj) {
            var latest = db.collection('latest');
            latest.insert(obj);
            findObj();
        }
        // end" save history
        // start: find documents in mongodb
        function findObj() {
            var search = db.collection('search');
            search.find({
            }, {
                "_id" : 1,
                "link" : 1,
                "id" : 1,
                "title" : 1
            }).limit(pagNum).toArray(function(err, results) {
                if (err) throw err;
                console.log("Returned #" + results.length + " documents");
                res.send({results});
            });
        } // end: find documents in mongodb
        
        app.get('/latest', function(req, res) {
            
            getHistory();
            
            function getHistory() {
               var latest = db.collection('latest');
               latest.find({
                }, {
                    "subject" : 1,
                    "date" : 1,
                    "_id" : 0
                }).toArray(function(err, data) {
                    if(err) throw err;
                    console.log(data);
                    res.send(data);
                });
                
            }
        
        });
        
    }); // end: app.get('/search/:query') 
        
   
}); // end of mongodb connections






app.listen(port, function() {
   console.log("Server started on port: " + port + "....");
});