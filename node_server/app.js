var http = require("http");

http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain-text'});
  res.end("Hello, I'm a Node js Server")
}).listen(8080, '0.0.0.0');

console.log("Listening on port 8080... ");