var GameClient = (function (_super) {
    __extends(GameClient, _super);
    function GameClient(connection, big) {
        _super.call(this, connection, big);
    }

    var d = __define, c = GameClient;
    p = c.prototype;

    p.init = function (server, id) {
        this.server = server;
        this.id = id;
        this.checkTime = (new Date()).getTime() + 30000;
        var bytes = new VByteArray();
        bytes.writeUIntV(100);
        bytes.writeUIntV(id);
        bytes.writeUTFV("你的 id 是" + id);
        this.sendData(new Buffer(bytes.data));
        setInterval(this.update.bind(this));
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
            //console.log("receive cmd :",cmd);
            switch (cmd) {
                case 0:
                    this.receiveHeart(bytes);
                    break;
                case 100:
                    this.close();
                    break;
                case 200:
                    this.receiveAnonce(bytes);
                    break;
                case 105:
                    if (GameClient.isWorking) {
                        this.sendAnonce("正在升级版本中... \n如果卡住了多等一会(ftp上传超时),更新程序会自动重试的,耐心等一会");
                    } else {
                        this.sendAllAnonce("正在升级版本中... \n如果卡住了多等一会(ftp上传超时),更新程序会自动重试的,耐心等一会");
                        GameClient.isWorking = true;
                        var _this = this;
                        var updateVersion = new UpdateVersion("../cocos2dxUpdateTool/", function () {
                            GameClient.isWorking = false;
                            console.log("updateVersion", updateVersion);
                            var back = "update game complete:\n" + updateVersion.log;
                            _this.sendAllAnonce(back);
                        });
                        GameClient.updateTime = (new Date()).getTime();
                    }
                    break;
            }
        }
    }

    p.update = function() {
        if(GameClient.isWorking) {
            var now = (new Date()).getTime();
            var gap = Math.floor((now - GameClient.updateTime)/1000);
            var hour = gap>3600?Math.floor(gap/3600):0;
            var minute = Math.floor((gap%3600)/60);
            var second = gap%60;
            var content = (hour?hour+"小时":"") + (minute<10?"0":"") + minute + "分" + (second<10?"0":"") + second + "秒";
            this.sendAllAnonce("正在升级版本中... \n如果卡住了多等一会(ftp上传超时),更新程序会自动重试的,耐心等一会\n已用时:" + content);
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

    p.close = function () {
        this.connection.close();
    }

    p.onClose = function () {
        _super.prototype.onClose.call(this);
    }

    GameClient.isWorking = false;

    return GameClient;
})(WebSocketServerClient);


global.GameClient = GameClient;
