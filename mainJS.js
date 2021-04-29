var http = require('http');
var fs = require('fs');
var port = process.env.PORT || 3000;

http.createServer(function (req, res) {
    fs.readFile("stock.html", function(err, txt) 
    {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(txt);
        res.end();
    });
}).listen(port);