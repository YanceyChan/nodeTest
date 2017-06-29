'use static';
const http = require('http');
const url = require('url');

const hostname = '127.0.0.1';
const port = 3000;

function start(route, handle){
  const server = http.createServer((req, res) => {
    var postData = "";
    const pathName = url.parse(req.url).pathname;
    const query = url.parse(req.url).query;
    console.log('Request ' + pathName + '\n' + 'Query: ' + query + '\n');

    req.setEncoding("utf-8");
    req.addListener("data", function(postDataChunk) {
      postData += postDataChunk;
      console.log("Received POST data chunk '"+
      postDataChunk + "'.");
    });

    req.addListener("end", function() {
      route(handle, pathName, res, postData);
    });

    // res.statusCode = 200;
    // res.setHeader('Content-Type', 'text/plain');
    // res.end('Hello World!!\n');
  });

  server.listen(port, hostname, () => {
    console.log(`服务器运行在 http://${hostname}:${port}/`);
  });
};

exports.start = start;
