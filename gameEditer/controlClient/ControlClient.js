require("./../../tools/com/requirecom");
require("./../../tools/shell/requireshell");
require("./../../tools/ftp/requireftp");
require("./../../tools/net/requirenet");

var ControlClient = (function (_super) {

    __extends(ControlClient, _super);

    function ControlClient() {
        _super.call(this);
    }

    var d = __define, c = ControlClient;
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
                        console.log("[ErrorCode]", code);
                    } else {
                        this.netSuccess(cmd);
                    }
                    break;

            }
        }
    }

    p.netSuccess = function (cmd) {
        if (cmd == 1) {
            var bytes = new VByteArray();
            bytes.writeUIntV(2);
            var jsFile = [
                "./tasks/editer/HttpServerGetFileTask.js"
            ];
            bytes.writeUIntV(jsFile.length);
            for(var i = 0; i < jsFile.length; i++) {
                bytes.writeUTFV(jsFile[i]);
            }
            this.sendData(bytes);
        } else if (cmd == 2) {
            var bytes = new VByteArray();
            bytes.writeUIntV(4);
            this.sendData(bytes);
            this.close();
        }
    }

    p.onConnect = function (connection) {
        _super.prototype.onConnect.call(this, connection);
        var bytes = new VByteArray();
        bytes.writeUIntV(1);
        bytes.writeUTFV("control");
        bytes.writeUTFV("admin");
        bytes.writeUTFV("duoduo520");
        this.sendData(bytes);
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

    return ControlClient;

})(WebScoektClient);

var client = new ControlClient();

client.connect("localhost", 9500);