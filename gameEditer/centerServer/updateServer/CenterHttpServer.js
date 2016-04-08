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
var server = new HttpServer(port, "");
server.start();

console.log("start center httpserver",port);

process.on('message', function (msg) {
    if (msg.type == "setTransIP") {
        server.setTransIP(msg.ip, msg.toServer, msg.toPort);
        process.send({"type": "setTransIPOK", "task": msg.task});
        //console.log("trans httpserver",msg.ip,msg.toServer,msg.toPort);
    }
});