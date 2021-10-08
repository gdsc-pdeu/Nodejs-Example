var http = require('http');
var url = require('url');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});

  var q = url.parse(req.url, true).query;
  var txt = q.year + " " + q.month;

  res.end(txt);

}).listen(8080);


// Running : http://localhost:8080/?year=2021&month=Hactober
// gives us ...
// 2021 Hactober
