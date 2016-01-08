var HttpServerGetFileTask = (function (_super) {

    __extends(HttpServerGetFileTask, _super);

    function HttpServerGetFileTask(user, httpServer, url, request, response) {
        this.httpServer = httpServer;
        this.request = request;
        this.response = response;
        this.url = url;
        _super.call(this, user);
    }

    var d = __define, c = HttpServerGetFileTask;
    var p = c.prototype;

    /**
     * 开始执行任务
     * @param cmd
     * @param msg
     */
    p.startTask = function (cmd, msg) {
        if (this.user.localClient == null) {
            this.httpServer.sendContent(this.request, this.response);
            this.success();
        } else {
            var bytes = new VByteArray();
            bytes.writeUIntV(501);
            bytes.writeUIntV(this.id);
            bytes.writeUIntV(102);
            bytes.writeUTFV(this.url);
            bytes.writeByte(0);
            this.user.localClient.sendData(bytes);
        }
    }

    p.excute = function (msg) {
        msg.readUTFV();
        msg.readUTFV();
        var d = msg.getData();
        var bytes = msg.getData().slice(msg.position, msg.length);
        this.httpServer.sendContent(this.request, this.response, bytes);
        this.success();
    }

    return HttpServerGetFileTask;

})(TaskBase);

global.HttpServerGetFileTask = HttpServerGetFileTask;