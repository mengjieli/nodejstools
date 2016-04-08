require("./../../../tools/com/requirecom");
require("./../../../tools/shell/requireshell");
require("./../../../tools/ftp/requireftp");
require("./../../../tools/net/requirenet");

require("./FileSyncClient")

function getArg(index) {
    if (process.argv.length > index) {
        return process.argv[index];
    }
    return null;
}

var FileSyncServer = (function (_super) {
    __extends(FileSyncServer, _super);

    function FileSyncServer() {
        _super.call(this, FileSyncClient);

        this.id = 0;

    }

    var d = __define, c = FileSyncServer;
    var p = c.prototype;

    p.connectClient = function (request) {
        var client = _super.prototype.connectClient.call(this, request);
        //console.log("clients:",this.clients.length);
        if (false && this.clients.length > 1) {
            client.close();
        } else {
            client.init(this, this.id);
            this.id += 1;
        }
        //console.log("client connect");
    }

    p.closeClient = function (event) {
        var client = _super.prototype.closeClient.call(this, event);
        //console.log("close client:", this.clients.length);
    }

    p.checkClient = function () {
        var clients = this.clients.concat();
        var time = (new Date()).getTime();
        for (var i = 0, len = clients.length; i < clients.length; i++) {
            clients[i].checkHeart(time);
        }
    }

    p.sendDataToAll = function (bytes) {
        for (var i = 0; i < this.clients.length; i++) {
            this.clients[i].sendDataGameClient.js(bytes);
        }
    }

    return FileSyncServer;

})(WebSocketServer);

process.on('message', function (m) {

});

var port = getArg(2);
var dir = getArg(3);
var userName = getArg(4);
var httpServerPort = parseInt(getArg(5));
global.httpServerPort = httpServerPort;
var file = new File(dir);
var server = new FileSyncServer();
server.start(port);

global.name = userName;
// process 存在 send 方法，用于向父进程发送消息
process.send({type: 'start'});