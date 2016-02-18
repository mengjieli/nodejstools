var Client = (function (_super) {

    __extends(Client, _super);

    function Client(connection, big) {
        _super.call(this, connection, big);
        this.type = "binary";
        //console.log(connection.remoteAddress);
        this.ip = connection.remoteAddress.split(":")[connection.remoteAddress.split(":").length-1];
    }

    var d = __define, c = Client;
    p = c.prototype;

    p.init = function (server, id) {
        this.httpServer = null;
        this.server = server;
        this.id = id;
        this.hasLogin = false;
        this.user = null;
        this.gameClient = null;
        this.checkTime = (new Date()).getTime() + 30000;
    }

    p.receiveData = function (message) {
        var data;
        if(message.type == "utf8") {
            this.type = "utf8";
            data = JSON.parse(message.utf8Data);
        }
        else if (message.type == "binary") {
            var data = message.binaryData;
        }
        var bytes = new VByteArray();
        bytes.readFromArray(data);
        var cmd = bytes.readUIntV();
        switch (cmd) {
            case 0:
                this.receiveHeart(bytes);
                return;
        }
        if (this.hasLogin == false && (cmd != 0 && cmd != 1)) {
            this.sendFail(10,cmd,bytes);
            this.close();
            return;
        }
        if (Config.cmds[cmd]) {
            var cls = global[Config.cmds[cmd]];
            if (cls == null) {
                this.sendFail(5,cmd,bytes);
            } else {
                try {
                    new cls(this.user, this, cmd, bytes);
                } catch(e) {
                    console.log(e);
                    this.sendFail(6,cmd,bytes,e);
                }
            }
        } else {
            this.sendFail(5,cmd,bytes);
        }
    }

    p.sendFail = function (errorCode, cmd, bytes,message) {
        message = message||"";
        var msg = new VByteArray();
        msg.writeUIntV(0);
        msg.writeUIntV(cmd);
        msg.writeUIntV(errorCode);
        msg.writeUTFV(message);
        bytes.position = 0;
        bytes.readUIntV();
        msg.writeBytes(bytes, bytes.position, bytes.length - bytes.position);
        this.sendData(msg);
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
        //if (time > this.checkTime) {
        //    //console.log(time, this.checkTime);
        //    this.close();
        //}
    }

    p.receiveAnonce = function (data) {
        var msg = data.readUTFV();
        this.sendAllAnonce(msg);
    }

    p.sendAllAnonce = function (msg) {
        var bytes = new VByteArray();
        bytes.writeUIntV(201);
        bytes.writeUTFV(msg);
        this.server.sendDataToAll(bytes);
    }

    p.sendAnonce = function (msg) {
        var bytes = new VByteArray();
        bytes.writeUIntV(201);
        bytes.writeUTFV(msg);
        this.sendData(bytes);
    }

    p.sendData = function (bytes) {
        if(this.type == "binary") {
            this.connection.sendBytes(new Buffer(bytes.data));
        } else if(this.type == "utf8") {
            var str = "[";
            var array = bytes.data;
            for(var i = 0; i < array.length; i++) {
                str += array[i] + (i<array.length-1?",":"");
            }
            str += "]";
            this.connection.sendUTF(str);
        }
    }

    p.close = function () {
        console.log("close connection!");
        this.connection.close();
    }

    //p.onClose = function () {
    //    _super.prototype.onClose.call(this);
    //}

    return Client;
})(WebSocketServerClient);


global.Client = Client;
