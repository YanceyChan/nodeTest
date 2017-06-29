'use static';
const express = require('express');
const app = express();
 
const hostname = '127.0.0.1';
const port = 8081;

//静态文件
app.use(express.static('public'));
app.get('/', function (req, res) {
   res.send('Hello World!!');
})
 
const server = app.listen(port, hostname, ()=>{
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})