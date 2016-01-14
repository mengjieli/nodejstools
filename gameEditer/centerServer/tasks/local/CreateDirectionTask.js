var CreateDirectionTask = (function (_super) {

    __extends(CreateDirectionTask, _super);

    function CreateDirectionTask(user, fromClient, cmd, msg) {
        _super.call(this, user, fromClient, cmd, msg);
    }

    var d = __define, c = CreateDirectionTask;
    var p = c.prototype;

    /**
     * 开始执行任务
     * @param cmd
     * @param msg
     */
    p.startTask = function (cmd, msg) {
        if (!this.user.localClient) {
            this.fail(20);
            return;
        }
        this.user.addTask(this)
        var bytes = new VByteArray();
        bytes.writeUIntV(501);
        bytes.writeUIntV(this.id);
        bytes.writeUIntV(this.cmd);
        var url = msg.readUTFV();
        bytes.writeUTFV(url);
        this.user.localClient.sendData(bytes);
    }

    p.excute = function (msg) {
        var bytes = new VByteArray();
        bytes.writeUIntV(this.cmd + 1);
        bytes.writeBytes(msg, msg.position, msg.length - msg.position);
        this.sendData(bytes);
        this.success();
    }

    return CreateDirectionTask;

})(TaskBase);

global.CreateDirectionTask = CreateDirectionTask;