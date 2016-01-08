require("./../../tools/com/requirecom");
require("./../../tools/shell/requireshell");
require("./../../tools/ftp/requireftp");
require("./../../tools/net/requirenet");

var LocalClient = (function (_super) {

    __extends(LocalClient, _super);

    function LocalClient() {
        _super.call(this);
        this.config = null;
    }

    var d = __define, c = LocalClient;
    var p = c.prototype;

    p.receiveData = function (message) {
        if (message.type == "binary") {
            var data = message.binaryData;
            var bytes = new VByteArray();
            bytes.readFromArray(data);
            var cmd = bytes.readUIntV();
            //console.log("[receive]", cmd);
            switch (cmd) {
                case 0:
                    var cmd = bytes.readUIntV();
                    var code = bytes.readUIntV();
                    if (code != 0) {
                        console.log("[ErrorCode]", code);
                    }
                    break;
                case 501:
                    this.receiveTask(bytes);
                    break;

            }
        }
    }

    p.receiveTask = function (msg) {
        var taskId = msg.readUIntV();
        var cmd = msg.readUIntV();
        var bytes = new VByteArray();
        bytes.writeUIntV(502);
        bytes.writeUIntV(taskId);
        console.log("[Task]",cmd);
        switch (cmd) {
            case 100: //读取文件夹文件列表
                this.readWorkDirection(msg, bytes);
                break;
            case 102:
                this.readFile(msg, bytes);
                break;
            case 120: //保存文件
                this.saveFile(msg, bytes);
                break;
            case 122: //创建文件夹
                this.makeDirection(msg, bytes);
                break;
            case 124: //文件或者文件夹是否存在
                this.isFileExist(msg, bytes);
                break;
        }
        if(bytes) {
            this.sendData(bytes);
        }
    }

    p.readWorkDirection = function (msg, bytes) {
        var url = msg.readUTFV();
        url = this.config.direction + url;
        var list = (new File(url)).readDirectionList();
        for (var i = 0; i < list.length; i++) {
            var file = list[i];
            if (file.url == url) {
                list.splice(i, 1);
                i--;
            }
        }
        bytes.writeUTFV(url);
        bytes.writeUIntV(list.length);
        console.log("read dir", url, list.length);
        for (var i = 0; i < list.length; i++) {
            var file = list[i];
            if (file.url == url) continue;
            if (file.type == FileType.DIRECTION) {
                bytes.writeByte(0);
            } else {
                bytes.writeByte(1);
            }
            bytes.writeUTFV(file.url);
        }
    }

    p.readFile = function (msg, bytes) {
        var url = msg.readUTFV();
        bytes.writeUTFV(url);
        url = this.config.direction + url;
        var format = msg.readByte();
        if (format == 0) {
            bytes.writeUTFV("");
            bytes.writeByteArray(UTFChange.stringToBytes((new File(url)).readContent()));
        } else if (format == 1) {
            bytes.writeUTFV((new File(url)).readContent());
        }
    }

    p.saveFile = function (msg, bytes) {
        var url = msg.readUTFV();
        var type = msg.readByte();
        var content;
        if (type == 1) {
            content = msg.readUTFV();
            (new File(url)).save(content);
            bytes.writeUTFV(url);
            bytes.writeByte(0);
        }
    }

    p.makeDirection = function (msg, bytes) {
        var path = msg.readUTFV();
        File.mkdirsSync(path);
        bytes.writeUTFV(path);
    }

    p.isFileExist = function (msg, bytes) {
        var path = msg.readUTFV();
        bytes.writeUTFV(path);
        bytes.writeBoolean((new File(path)).isExist());
    }

    p.onConnect = function (connection) {
        _super.prototype.onConnect.call(this, connection);
        var content = (new File("config.json")).readContent();
        var cfg = JSON.parse(content);
        this.config = cfg;
        var bytes = new VByteArray();
        bytes.writeUIntV(1);
        bytes.writeUTFV("local");
        bytes.writeUTFV(cfg.name);
        bytes.writeUTFV(cfg.password);
        bytes.writeUTFV(System.IP);
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

    return LocalClient;

})(WebScoektClient);

var client = new LocalClient();

client.connect("localhost", 9500);