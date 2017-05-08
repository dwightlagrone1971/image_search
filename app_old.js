var express = require('express');
var path = require('path');
var mongo = require('mongodb');
var bodyParser = require('body-parser');
var imgur = require('imgur');
var https = require('https');
var flatten = require('flat')

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
        
        cleanDatabase();
        
        function cleanDatabase() {
        
            db.collection('search', {}, function(err, search) {
                if (err) throw err;
                search.remove({}), function(err, results) {
                    if (err) {
                        console.log(err);
                    }
    
                };
            });
            
        } 
        
        var url = req.params.query;
        var size = req.query.offset || 10;
        
        // assign authentication variable to imgur
        var options = {
            hostname: 'api.imgur.com',
            path: '/3/gallery/search/?' + url,
            headers: {'Authorization': 'Client-ID f472a29449d911f'},
            method: 'GET'
        };
        
        // build body for imgur response found on stack overflow by rdjs 
        //http://stackoverflow.com/questions/11826384/calling-a-json-api-with-node-js
        https.get(options, function(res) {
          var body = "";
          
          res.on('data', function(chunk) {
            body += chunk;
          });
          
          res.on('end', function() {
            var fbResponse = JSON.parse(body);
            console.log("Object was created successfully!!");
            insertObj(fbResponse);
          });
        }).on('error', function(e) {
          console.log("Got an error: ", e);
        });
        // insert object into monlab
        function insertObj(d) {
          var search = db.collection('search');
          search.insert(d);
          console.log("Save was successful!!!");
          findObj();
        }
        // find data and return to user
        function findObj() {
            var search = db.collection('search');
            search.find({ }, {
                "_id" : 0,
                "data.link" : 1,
                "data.id" : 1,
                "data.title" : 1,
            }).limit(5).toArray(function(err, data) {
                if (err) throw err;
                if(data.length > 0) {
                    data = data[0];
                    res.send(data);
                } else {
                    res.send("err: There is no data in that search!!!");
                }
                
                
                
            });
        }
      
    });
    
}); // end of mongodb connections






app.listen(port, function() {
   console.log("Server started on port: " + port + "....");
});