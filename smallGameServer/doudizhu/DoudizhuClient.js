var DoudizhuClient = (function (_super) {
    __extends(DoudizhuClient, _super);
    function DoudizhuClient(connection, big) {
        _super.call(this, connection, big);
    }

    var d = __define, c = DoudizhuClient;
    p = c.prototype;

    p.init = function (server, id) {
        this.server = server;
        this.id = id;
        this.checkTime = (new Date()).getTime() + 30000;
        this.nick = "玩家" + id;
        this.score = 0;
        this.ready = 0;

        //通知玩家个人信息:1000
        //string  id  玩家id
        //string  nick  玩家昵称
        //int  score  游戏积分
        var msg = new VByteArray();
        msg.writeUIntV(1000);
        msg.writeUIntV(this.id);
        msg.writeUTFV(this.nick);
        msg.writeIntV(this.score);
        this.sendData(new Buffer(msg.data));
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
            console.log("receive cmd :",cmd);
            switch (cmd) {
                case 0:
                    this.receiveHeart(bytes);
                    break;
                case 1005:
                    this.readyPlay(bytes);
                    break;
                case 1013:
                    this.sendCardComplete(bytes);
                    break;
                case 1015:
                    this.callBottom(bytes);
                    break;
                case 1021:
                    this.showCard(bytes);
                    break;

            }
        }
    }

    p.enterRoom = function (room) {
        this.room = room;
    }

    p.hasRoom = function () {
        return this.room ? true : false;
    }

    p.readyPlay = function (bytes) {
        this.ready = 1;
        this.dispatchEvent(new Event("ready"));
    }

    p.sendCardComplete = function (bytes) {
        this.dispatchEvent(new Event("sendCardComplete"));
    }

    p.callBottom = function(bytes) {
        var score = bytes.readUIntV();
        this.dispatchEvent(new Event("callBottom",score));
    }

    p.showCard = function(bytes) {
        //出牌:1021
        //Array    如果长度为0则表示 pass
        //uint  cardId  牌id
        var len = bytes.readUIntV();
        var cards = [];
        for(var i = 0; i < len; i++) {
            cards.push(bytes.readUIntV());
        }
        this.dispatchEvent(new Event("showCard",cards));
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
        console.log("close nmb!",arguments.callee.caller);
        this.connection.close();
    }

    p.onClose = function () {
        _super.prototype.onClose.call(this);
    }

    DoudizhuClient.isWorking = false;

    return DoudizhuClient;
})(WebSocketServerClient);


global.DoudizhuClient = DoudizhuClient;