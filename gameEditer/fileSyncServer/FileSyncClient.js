var FileSyncClient = (function (_super) {

    __extends(FileSyncClient, _super);

    function FileSyncClient(connection, big) {
        _super.call(this, connection, big);
        this.type = "binary";
        //console.log(connection.remoteAddress);
        this.ip = connection.remoteAddress.split(":")[connection.remoteAddress.split(":").length-1];
    }

    var d = __define, c = FileSyncClient;
    p = c.prototype;

    p.init = function (server, id) {
        this.httpServer = null;
        this.server = server;
        this.id = id;
        this.name = "";
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
            case 1:
                this.login();
                return;
        }
    }

    p.startHttpServer = function() {
        if(this.httpServer) {
            this.httpServer.close();
        }
        this.httpServer = new HttpServer();
    }

    p.login = function(bytes) {
        var name = bytes.readUTFV();
        if(name == this.name) {
            var msg = new VByteArray();
            msg.writeInt(0);
            msg.writeInt(1);
            msg.writeInt(0);
            this.sendData(msg);
        } else {
            this.close();
        }
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

    return FileSyncClient;
})(WebSocketServerClient);


global.FileSyncClient = FileSyncClient;