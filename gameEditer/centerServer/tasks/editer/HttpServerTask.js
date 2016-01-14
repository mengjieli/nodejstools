var HttpServerTask = (function (_super) {

    __extends(HttpServerTask, _super);

    function HttpServerTask(user, fromClient, cmd, msg) {
        _super.call(this, user, fromClient, cmd, msg);
    }

    var d = __define, c = HttpServerTask;
    var p = c.prototype;

    /**
     * 开始执行任务
     * @param cmd
     * @param msg
     */
    p.startTask = function (cmd, bytes) {
        var port = bytes.readUIntV();
        try {
            while (HttpServerTask.httpPorts[port] != null) {
                port = 9501 + Math.floor(Math.random() * 10000);
            }
            var httpServer = new EditerHttpServer(port,this.user);
            httpServer.start();
            HttpServerTask.httpPorts[port] = true;
            this.httpServer = httpServer;
            var msg = new VByteArray();
            msg.writeUIntV(this.cmd+1);
            msg.writeBoolean(true);
            msg.writeUIntV(port);
            this.sendData(msg);
            this.success();
            console.log("start http server success :,", port);
        }
        catch (error) {
            var msg = new VByteArray();
            msg.writeUIntV(this.cmd+1);
            msg.writeBoolean(false);
            msg.writeUIntV(port);
            this.sendData(msg);
            this.fail(1000);
            console.log("start http server fail :,", port,error);
        }
    }

    HttpServerTask.httpPorts = {};

    return HttpServerTask;

})(TaskBase);

global.HttpServerTask = HttpServerTask;