/**
 * Created by mengjieli on 16/3/24.
 * 文件同步模块
 */
require("./tools/com/requirecom");
require("./tools/net/requirenet");

var fs = require("fs"),
    path = require("path");

/**
 * 文件信息
 * @constructor
 */
var FileInfo = function (file, direction) {
    this.file = file;
    this.url = file.url;
    this.createTime = 0;
}

function getArg(index) {
    if (process.argv.length > index) {
        return process.argv[index];
    }
    return null;
}

var direction = path.resolve(process.cwd(), getArg(2) || "/Users/mengjieli/Documents/paik/paike_client/ParkerEmpire/res");
var serverIp = getArg(3) || "localhost";
var serverPort = getArg(4) || 9002;
var user = getArg(5) || "limengjie";


var FileClient = (function (_super) {

    __extends(LocalClient, _super);

    function LocalClient() {
        _super.call(this);
    }

    var d = __define, c = LocalClient;
    var p = c.prototype;

    p.receiveData = function (message) {
        if (message.type == "binary") {
            var data = message.binaryData;
            var bytes = new VByteArray();
            bytes.readFromArray(data);
            var cmd = bytes.readUIntV();
            switch (cmd) {
                case 0:
                    var cmd = bytes.readUIntV();
                    var code = bytes.readUIntV();
                    if (code != 0) {
                        this.print("Error", "ErrorCode : " + code);
                    }
                    if(cmd == 1) {
                        this.print("Error", "File client login fail.");
                        this.close();
                    }
                    break;

            }
        }
    }

    p.onConnect = function (connection) {
        _super.prototype.onConnect.call(this, connection);
        var content = (new File("config.json")).readContent();
        var cfg = JSON.parse(content);
        this.config = cfg;
        var bytes = new VByteArray();
        bytes.writeUIntV(1);
        bytes.writeUTFV("fileServer");
        bytes.writeUTFV(user);
        bytes.writeUTFV(cfg.password);
        bytes.writeUTFV(System.IP);
        this.sendData(bytes);
        var _this = this;
        setTimeout(function () {
            var bytes = new VByteArray();
            bytes.writeByte(0);
            bytes.writeByte(0);
            bytes.writeByte(0);
            bytes.writeByte(0);
            _this.sendData(bytes);
        }, 10000);
    }

    p.sendData = function (bytes) {
        this.connection.sendBytes(new Buffer(bytes.data));
    }

    p.close = function () {
        this.connection.close();
    }

    p.onClose = function () {
        _super.prototype.onClose.call(this);
    }

    p.print = function (type, msg) {
        var cfg = {
            "type": type,
            "msg": msg
        }
        console.log(JSON.stringify(cfg))
    }

    return LocalClient;

})(WebScoektClient);

var server = new WebScoektClient();
server.connect(serverIp, serverPort);


/**
 * 链接服务器
 */

/**
 * 检查并与服务器同步文件信息
 */
var checkDirection = function () {

}