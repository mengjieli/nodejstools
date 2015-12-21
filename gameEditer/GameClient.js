var GameClient = (function (_super) {
    __extends(GameClient, _super);
    function GameClient(connection, big) {
        _super.call(this, connection, big);
    }

    var d = __define, c = GameClient;
    p = c.prototype;

    p.init = function (server, id) {
        this.httpServer = null;
        this.server = server;
        this.id = id;
        this.checkTime = (new Date()).getTime() + 30000;
        var bytes = new VByteArray();
        bytes.writeUIntV(100);
        bytes.writeUIntV(id);
        bytes.writeUTFV("你的 id 是" + id);
        this.sendData(new Buffer(bytes.data));
    }

    p.sendData = function (buffer) {
        this.connection.sendBytes(buffer);
    }

    p.receiveData = function (message) {
        if (message.type == "binary") {
            var data = message.binaryData;
            var bytes = new VByteArray();
            bytes.readFromArray(data);
            var cmd = bytes.readUIntV();
            console.log("receive message:", cmd);
            switch (cmd) {
                case 0:
                    this.receiveHeart(bytes);
                    break;
                case 2:
                    this.startHttpServer(bytes);
                    break;
                case 10: //读取文件夹文件列表
                    this.readWorkDirection(bytes);
                    break;
                case 20: //保存文件
                    this.saveFile(bytes);
                    break;
                case 22: //创建文件夹
                    this.makeDirection(bytes);
                    break;
                case 200:
                    this.receiveAnonce(bytes);
                    break;
            }
        }
    }

    p.receiveHeart = function (data) {
        var a = data.readUIntV();
        var b = data.readUIntV();
        var c = data.readUIntV();
        if (!a && !b && !c) {
            this.checkTime = (new Date()).getTime() + 30000;
        }
    }

    p.checkHeart = function (time) {
        if (time > this.checkTime) {
            console.log(time, this.checkTime);
            this.close();
        }
    }

    /**
     * 启动 http 资源服务器
     * @param bytes
     */
    p.startHttpServer = function (bytes) {
        var port = bytes.readUIntV();
        var dir = bytes.readUTFV();
        var success = 0;
        var find = false;
        for (var key in GameClient.httpPorts) {
            if (GameClient.httpPorts[key] == dir) {
                find = true;
                port = parseInt(key);
                break;
            }
        }
        if (!find) {
            try {
                while (GameClient.httpPorts[port] != null) {
                    port = 9501 + Math.floor(Math.random() * 10000);
                }
                var httpServer = new HttpServer(port, dir);
                httpServer.start();
                GameClient.httpPorts[port] = dir;
                this.httpServer = httpServer;
                console.log("start http server success :,", dir, port);
            }
            catch (error) {
                success = 1;
                console.log("start http server fail :,", dir, port);
            }
        }
        var bytes = new VByteArray();
        bytes.writeUIntV(3);
        bytes.writeByte(success);
        bytes.writeUIntV(port);
        bytes.writeUTFV(dir);
        this.sendData(new Buffer(bytes.data));
    }

    p.receiveAnonce = function (data) {
        var msg = data.readUTFV();
        this.sendAllAnoce(msg);
    }

    p.sendAllAnonce = function (msg) {
        var bytes = new VByteArray();
        bytes.writeUIntV(201);
        bytes.writeUTFV(msg);
        this.server.sendDataToAll(new Buffer(bytes.data));
    }

    p.sendAnonce = function (msg) {
        var bytes = new VByteArray();
        bytes.writeUIntV(201);
        bytes.writeUTFV(msg);
        this.sendData(new Buffer(bytes.data));
    }

    p.readWorkDirection = function (msg) {
        var url = msg.readUTFV();
        var list = (new File(url)).readDirectionList();
        for (var i = 0; i < list.length; i++) {
            var file = list[i];
            if (file.url == url) {
                list.splice(i, 1);
                i--;
            }
        }
        var bytes = new VByteArray();
        bytes.writeUIntV(11);
        bytes.writeUTFV(url);
        bytes.writeUIntV(list.length);
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
        this.sendData(new Buffer(bytes.data));
    }

    p.saveFile = function (msg) {
        var url = msg.readUTFV();
        var type = msg.readByte();
        var content;
        if (type == 1) {
            content = msg.readUTFV();
            (new File(url)).save(content);
            var bytes = new VByteArray();
            bytes.writeUIntV(21);
            bytes.writeUTFV(url);
            bytes.writeByte(0);
            this.sendData(new Buffer(bytes.data));
        }
    }

    p.makeDirection = function (msg) {
        var path = msg.readUTFV();
        File.mkdirsSync(path);
        var bytes = new VByteArray();
        bytes.writeUIntV(23);
        bytes.writeUTFV(path);
        this.sendData(new Buffer(bytes.data));
    }

    p.close = function () {
        this.connection.close();
    }

    p.onClose = function () {
        _super.prototype.onClose.call(this);
    }

    GameClient.httpPorts = {};

    GameClient.isWorking = false;

    return GameClient;
})(WebSocketServerClient);


global.GameClient = GameClient;
