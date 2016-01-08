require("./../../tools/com/requirecom");
require("./../../tools/shell/requireshell");
require("./../../tools/ftp/requireftp");
require("./../../tools/net/requirenet");

require("./requires");

var list = (new File("./tasks")).readFilesWidthEnd("js");
for(var i = 0; i < list.length; i++) {
    var url = list[i].url;
    url = url.slice(0,url.length - 3);
    require(url);
}
var socketPort = 9500;

var CenterServer = (function (_super) {
    __extends(CenterServer, _super);

    function CenterServer() {
        _super.call(this, Client);

        this.id = 0;

        //读取配置文件
        var txt = (new File("./data/User.json")).readContent();
        Config.initUsers(JSON.parse(txt));
        txt = (new File("./data/Command.json")).readContent();
        Config.cmds = JSON.parse(txt);

        setInterval(this.checkClient.bind(this), 30000);
    }

    var d = __define, c = CenterServer;
    var p = c.prototype;

    p.connectClient = function (request) {
        var client = _super.prototype.connectClient.call(this, request);
        client.init(this, this.id);
        this.id += 1;
        //console.log("client connect");
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

    return CenterServer;

})(WebSocketServer);

var server = new CenterServer();
server.start(socketPort);