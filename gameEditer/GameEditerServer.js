require("./../tools/com/requirecom");
require("./../tools/shell/requireshell");
require("./../tools/ftp/requireftp");
require("./../tools/net/requirenet");

require("./GameConfig");
require("./GameClient");

var socketPort = 9500;

var GameServer = (function (_super) {
    __extends(GameServer, _super);

    function GameServer() {
        _super.call(this, GameClient);

        this.id = 0;

        setInterval(this.checkClient.bind(this), 30000);
    }

    var d = __define, c = GameServer;
    var p = c.prototype;

    p.connectClient = function (request) {
        var client = _super.prototype.connectClient.call(this, request);
        client.init(this, this.id++);
    }

    p.closeClient = function (event) {
        var client = _super.prototype.closeClient.call(this, event);
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

    return GameServer;

})(WebSocketServer);

var server = new GameServer();
server.start(socketPort);