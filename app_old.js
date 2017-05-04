var express = require('express');
var path = require('path');
var mongo = require('mongodb');
var imgur = require('imgur');
var https = require('https');
var JSONPath = require('JSONPath');

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
        
        // get user inputed url
        var url = req.params.query;
        var size = req.params.offset || 10;
        
        var options = {
            hostname: 'api.imgur.com',
            path: '/3/gallery/search/?' + url,
            headers: {'Authorization': 'Client-ID f472a29449d911f'},
            method: 'GET'
        };
        // assign authentication variable to imgur
        var history = {
            "term" : url,
            "when" : new Date().toLocaleString()
        }
        if(url!== 'favicon.cio') {
            save(history);
        }
        
        
        
        
        // build body for imgur response found on stack overflow by rdjs 
        //http://stackoverflow.com/questions/11826384/calling-a-json-api-with-node-js
        https.get(options, function(res) {
            var body = "";
          
            res.on('data', function(chunk) {
                body += chunk;
            });
          
            res.on('end', function() {
                var fbResponse = JSON.parse(body);
                pleaseSend(fbResponse);
            });
        }).on('error', function(e) {
            console.log("Got an error: ", e);
        });
        function pleaseSend(d) {
            
            var result = [];
            var title = d.data.title;
            for (var links in title) {
              if (title.hasOwnProperty(links)) {
                result.push({links: links, title: title[links]});
              }
            }
            
            res.contentType('application/json');
            res.send(JSON.stringify(result));
            
            
        }
    });
    
}); // end of mongodb connections
