var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.render('index.html');
});

// app.post('/results', function(req, res){
//   console.log(req.body.searchTerm);
//   request({
//      url: 'https://en.wikipedia.org/w/api.php',
//     //  headers: {
//     //   'Content-Type': 'application/json; charset=UTF-8'
//     // },
//      params: {
//         'action': 'query',
//         'titles': req.body.searchTerm,
//         'prop': 'revisions',
//         'rvprop': 'timestamp|content',
//         'format': 'json',
//         'rvlimit': 'max'
//         //'callback': 'JSON_CALLBACK'
//      }
//    }, function(error, response, body) {
//     if (!error && response.statusCode === 200) {
//        var data = body;
//        console.log(data);
//     }; 
//     //res.send({data:data});
//     });
// });

app.get('/*', function(req, res) {
  res.sendFile(__dirname, 'public/index.html');
});

var server = app.listen(process.env.PORT || 3000);

module.exports = server;