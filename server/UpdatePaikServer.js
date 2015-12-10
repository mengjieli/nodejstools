var http = require("http");
var url = require('url');
require("./../cocos2dxUpdateTool/UpdateVersion");
var isWork = false;

http.createServer(function (request, response) {
    var query = url.parse(request.url).query;
    console.log("qurey : ", query);
    if(!isWork) {
        isWork = true;
        var update = new UpdateVersion("../cocos2dxUpdateTool/", function () {
            response.writeHead(200, {"Content-Type": "text/plain"});
            var back = "update game complete:\n" + update.log;
            console.log(back);
            response.write(back);
            response.end();
            isWork = false;
        });
    } else {
        //response.writeHead(200, {"Content-Type": "text/plain"});
        //response.write('<head><meta charset="utf-8"/></head>');
        //response.write("");

        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write('<head><meta charset="utf-8"/></head>');
        response.write('正在更新中，请稍后再试');
        response.end();
    }
}).listen(8889);