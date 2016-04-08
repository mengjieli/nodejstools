require("./../../../tools/com/requirecom");
require("./../../../tools/shell/requireshell");
require("./../../../tools/net/requirenet");
require("./../../../tools/ftp/requireftp");


function getArg(index) {
    if (process.argv.length > index) {
        return process.argv[index];
    }
    return null;
}

var port = getArg(2);
var dir = getArg(3);

var server = new HttpServer(port, dir);
server.start();

process.on('message', function (msg) {
    if (msg.type == "close") {
        server.close();
    }
});

//console.log("start httpserver",port,dir);