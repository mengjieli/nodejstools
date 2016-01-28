var GetGameClientListTask = (function (_super) {

    __extends(GetGameClientListTask, _super);

    function GetGameClientListTask(user, fromClient, cmd, msg) {
        _super.call(this, user, fromClient, cmd, msg);
    }

    var d = __define, c = GetGameClientListTask;
    var p = c.prototype;

    /**
     * 开始执行任务
     * @param cmd
     * @param msg
     */
    p.startTask = function (cmd, msg) {
        var list = GameClient.clients;
        var bytes = new VByteArray();
        bytes.writeUIntV(2003);
        bytes.writeUIntV(this.remoteId);
        bytes.writeUIntV(list.length);
        for(var i = 0; i < list.length; i++) {
            var client = list[i];
            bytes.writeUIntV(client.id);
            bytes.writeUTFV(client.gameName);
        }
        this.sendData(bytes);
        this.success();
    }

    return GetGameClientListTask;

})(TaskBase);

global.GetGameClientListTask = GetGameClientListTask;