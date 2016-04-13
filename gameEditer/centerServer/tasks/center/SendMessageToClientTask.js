var SendMessageToClientTask = (function (_super) {

    __extends(SendMessageToClientTask, _super);

    function SendMessageToClientTask(user, fromClient, cmd, msg) {
        _super.call(this, user, fromClient, cmd, msg);
    }

    var d = __define, c = SendMessageToClientTask;
    var p = c.prototype;

    /**
     * 开始执行任务
     * @param cmd
     * @param msg
     */
    p.startTask = function (cmd, msg) {
        var name = msg.readUTFV();
        var user = User.getUserByName(name);
        var type = msg.readUTFV();
        var client = user.getClientByType(type);
        console.log("[Trans msg  to ]",name,type,msg.bytesAvailable());
        if (!client) {
            this.fail(25);
        } else {
            var sendMsg = new VByteArray();
            while (msg.bytesAvailable()) {
                sendMsg.writeByte(msg.readByte());
            }
            client.sendData(sendMsg);
            this.success();
        }
    }

    return SendMessageToClientTask;

})(TaskBase);

global.SendMessageToClientTask = SendMessageToClientTask;