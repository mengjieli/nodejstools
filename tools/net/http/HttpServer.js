var http = require("http");
var url = require('url');
var query = require("querystring");    //解析POST请求

var mine = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
};

var HttpServer = function (port, root) {
    this.port = port;
    this.root = root || ".";
    if (this.root.charAt(this.root.length - 1) == "/") {
        this.root = this.root.slice(0, this.root.length - 1);
    }
}

HttpServer.prototype.onReciveRequest = function (request, response) {
    if (request.method == "GET") {
        this.sendResource(request, response);
    } else if (request.method == "POST") {
        this.receivePost(request, response);
    }
}

HttpServer.prototype.start = function () {
    http.createServer(this.onReciveRequest.bind(this)).listen(this.port);
}

HttpServer.prototype.sendResource = function (request, response) {
    var url = request.url;
    url = url.split("?")[0];
    var file = new File(this.root + url);
    console.log("[http-server]", this.root + url, file.isExist());
    if (!file.isExist()) {
        response.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        response.write("This request URL " + url.parse(request.url).pathname + " was not found on this server.");
        response.end();
    } else {
        var content = file.readContent("binary");
        end = request.url.split("?")[0];
        end = end.split(".")[end.split(".").length - 1];
        response.writeHead(200, {
            'Content-Type': mine[end],
            "Access-Control-Allow-Origin": "*",
            "Accept-Ranges": "bytes"
        });
        response.write(content, "binary");
        response.end();
    }
}

HttpServer.prototype.sendContent = function (request, response, content) {
    if (!content) {
        response.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        response.write("This request URL " + url.parse(request.url).pathname + " was not found on this server.");
        response.end();
    } else {
        end = request.url.split("?")[0];
        end = end.split(".")[end.split(".").length - 1];
        response.writeHead(200, {
            'Content-Type': mine[end],
            "Access-Control-Allow-Origin": "*",
            "Accept-Ranges": "bytes"
        });
        response.write(content, "binary");
        response.end();
    }
}

HttpServer.prototype.receivePost = function (request, response) {
    var postdata = "";
    request.addListener("data", function (postchunk) {
        postdata += postchunk;
    });
    var _this = this;
    //POST结束输出结果
    request.addListener("end", function () {
        _this.receivePostComplete(request, response, postdata);
    });
}

HttpServer.prototype.receivePostComplete = function (request, response, data) {

}

HttpServer.prototype.sendMessage = function (response, message) {
    response.writeHead(200, {
        'Content-Type': 'text/plain',
        "Access-Control-Allow-Origin": "*"
    });
    response.write(message);
    response.end();
}

global.HttpServer = HttpServer;