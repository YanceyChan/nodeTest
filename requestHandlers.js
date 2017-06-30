const exec = require("child_process").exec;
const querystring = require("querystring");
const fs = require("fs");
const formidable = require("formidable");
const url = require('url');

function start(response, request) {
  console.log("Request handler 'start' was called.");
  //将耗时操作放进子进程
//   exec("find /",
//     { timeout: 10000, maxBuffer: 20000*1024 },
//     function (error, stdout, stderr) {
//       response.writeHead(200, {"Content-Type": "text/plain"});
//       response.write(stdout);
//       response.end();
//     });

    //下面的html是填写文字表单
    // const body = '<html>'+
    //             '<head>'+
    //                 '<meta http-equiv="Content-Type" content="text/html; '+
    //                 'charset=UTF-8" />'+
    //             '</head>'+
    //             '<body>'+
    //                 '<form action="/upload" method="post">'+
    //                     '<textarea name="text" rows="20" cols="60"></textarea>'+
    //                     '<input type="submit" value="Submit text" />'+
    //                 '</form>'+
    //             '</body>'+
    //             '</html>';

    //上传图片到服务器
    var body = '<html>'+
                    '<head>'+
                        '<meta http-equiv="Content-Type" '+
                        'content="text/html; charset=UTF-8" />'+
                    '</head>'+
                    '<body>'+
                        '<form action="/upload" enctype="multipart/form-data" '+
                        'method="post">'+
                            '<input type="file" name="upload">'+
                            '<input type="submit" value="Upload file" />'+
                        '</form>'+
                    '</body>'+
                '</html>';

    response.writeHead(200, {"Content-Type": "text/html; charset=utf8"});
    response.write(body);
    response.end();
}

function upload(response, request) {
  console.log("Request handler 'upload' was called.");

  const form = new formidable.IncomingForm();
  console.log('about to parse');
  form.parse(request, (error, fields, files)=> {
    console.log("parsing done");
    // console.log(fields);
    const filePath = files.upload.path;
    const finalPath = "./tmp/" + files.upload.name;
    fs.renameSync(files.upload.path, finalPath);
        // console.log(files);
        response.writeHead(200, {"Content-type": "text/html"});
        response.write("Received image:<br>");
        const imageBody = "<image src=/show?name=" + files.upload.name + " />";
        response.write(imageBody);
        response.end();
    
  });

//   response.writeHead(200, {"Content-Type": "text/plain; charset=utf8"});
//   response.write("You've sent: " + querystring.parse(postData).text);
//   response.end();
}

function show(response, request) {
  console.log("Request handler 'show' was called.");
  console.log('reqrest:'+ request.url);
  console.log('pathname: ' + url.parse(request.url).pathname);
  console.log('path: ' + url.parse(request.url).path);
  const imageName = querystring.parse(url.parse(request.url).query)["name"]; 
  const fileName = "./tmp/" + imageName;
  console.log('fileName: ' + fileName);
  fs.readFile(fileName, "binary", function(error, file) {
    if(error) {
      response.writeHead(500, {"Content-Type": "text/plain"});
      response.write(error + "\n");
      response.end();
    } else {
      response.writeHead(200, {"Content-Type": "image/png"});
      response.write(file, "binary");
      response.end();
    }
  });
}

exports.start = start;
exports.upload = upload;
exports.show = show;