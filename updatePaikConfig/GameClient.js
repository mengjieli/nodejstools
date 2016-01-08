

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
        //var bytes = new VByteArray();
        //bytes.writeUIntV(100);
        //bytes.writeUIntV(id);
        //bytes.writeUTFV("你的 id 是" + id);
        //this.sendData(new Buffer(bytes.data));
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
            console.log("update config cmd:", cmd);
            switch (cmd) {
                case 0:
                    this.receiveHeart(bytes);
                    break;
                case 100: //读取文件夹文件列表
                    this.updateConfig(bytes);
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
            //this.close();
        }
    }

    p.updateConfig = function (bytes) {
        var type = bytes.readUIntV();
        var bytes = new VByteArray();
        bytes.writeUIntV(100);
        if (GameClient.isWorking == false) {
            GameClient.workType = type;
            GameClient.isWorking = true;
            new UpdateTask(function(url){
                GameClient.isWorking = false;
                var completeMessage = new VByteArray();
                completeMessage.writeUIntV(101);
                completeMessage.writeUTFV(url);
                this.sendData(new Buffer(completeMessage.data));
            },this);
        } else {
            type = GameClient.workType;
        }
        if (type == 1) {
            bytes.writeUTFV("192.168.1.201:13212/empery/data/");
        } else if (type == 2) {
            bytes.writeUTFV("123.59.49.175:13212/empery/data/");
        }
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
    GameClient.workType = 0;

    return GameClient;
})(WebSocketServerClient);


global.GameClient = GameClient;
