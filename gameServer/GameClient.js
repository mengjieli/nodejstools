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
            switch (cmd) {
                case 0:
                    this.receiveHeart(bytes);
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
            console.log(time,this.checkTime);
            this.close();
        }
    }

    p.receiveAnonce = function (data) {
        var msg = data.readUTFV();
        var bytes = new VByteArray();
        bytes.writeUIntV(201);
        bytes.writeUTFV(msg);
        this.server.sendDataToAll(new Buffer(bytes.data));
    }

    p.close = function () {
        this.connection.close();
    }

    p.onClose = function () {
        _super.prototype.onClose.call(this);
    }

    return GameClient;
})(WebSocketServerClient);


global.GameClient = GameClient;
