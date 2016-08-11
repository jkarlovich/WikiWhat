var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var wtf_wikipedia = require('wtf_wikipedia');

var app = express();

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.render('index.html');
});

app.post('/results', function(req, res){
  console.log(req.body.searchTerm);
  request({
     url: 'https://en.wikipedia.org/w/api.php',
     qs: {
        'action': 'query',
        'titles': req.body.searchTerm,
        'prop': 'revisions',
        'rvprop': 'timestamp|content',
        'format': 'json',
        'rvlimit': '0'
     }
   }, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var data = JSON.parse(body);
      data = data.query.pages[Object.keys(data.query.pages)];
      var results = data.revisions;
      console.log('results: ' + results);
      console.log('---------------------');
      console.log(results);
      console.log('----------------------');
      console.log(results[0]['*']);
      var content = [];
      results.forEach(function(result) {
        var foo = [];
        foo.push(wtf_wikipedia.plaintext(result['*']));
        //console.log(foo);
        //var bar = foo.replace(/\n/, 'AA');
        //console.log('bar: ' + bar);
        content.push(wtf_wikipedia.plaintext(result['*']));
      });
      console.log(content);
    }; 
    res.send({data:data, content:content});
    });
});

app.get('/*', function(req, res) {
  res.sendFile(__dirname, 'public/index.html');
});

var server = app.listen(process.env.PORT || 3000);

module.exports = server;