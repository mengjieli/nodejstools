var ConnectGameClientTask = (function (_super) {

    __extends(ConnectGameClientTask, _super);

    function ConnectGameClientTask(user, fromClient, cmd, msg) {
        _super.call(this, user, fromClient, cmd, msg);
    }

    var d = __define, c = ConnectGameClientTask;
    var p = c.prototype;

    /**
     * 开始执行任务
     * @param cmd
     * @param msg
     */
    p.startTask = function (cmd, msg) {
        var id = msg.readUIntV();
        var client = GameClient.getClient(id);
        this.linkClient = client;
        if (!client) {
            this.fail(21);
        } else if(client.user) {
            this.fail(24);
        } else {
            var bytes = new VByteArray();
            bytes.writeUIntV(501);
            bytes.writeUIntV(this.id);
            bytes.writeUIntV(this.cmd);
            bytes.writeUTFV(this.user.name);
            if (client.sendData(bytes) == false) {
                this.fail(22);
            }
        }
    }

    p.excute = function (msg) {
        var bytes = new VByteArray();
        bytes.writeUIntV(this.cmd + 1);
        bytes.writeUIntV(this.remoteId);
        var flag = msg.readBoolean();
        msg.position--;
        if (flag) {
            var client = this.linkClient;
            if (!client) {
                this.fail(21);
                return;
            }
            if(client.localClient.user) {
                this.fail(24);
                return;
            }
            client.localClient.user = this.user;
            var code = this.user.loginGameClient(client);
            if(code != 0) {
                this.fail(code);
                return;
            }
        }
        bytes.writeBytes(msg, msg.position, msg.length - msg.position);
        this.sendData(bytes);
        this.success();
    }

    return ConnectGameClientTask;

})(TaskBase);

global.ConnectGameClientTask = ConnectGameClientTask;