var GameLogTask = (function (_super) {

    __extends(GameLogTask, _super);

    function GameLogTask(user, fromClient, cmd, msg) {
        _super.call(this, user, fromClient, cmd, msg);
    }

    var d = __define, c = GameLogTask;
    var p = c.prototype;

    /**
     * 开始执行任务
     * @param cmd
     * @param msg
     */
    p.startTask = function (cmd, msg) {
        if(this.user) {
            var bytes = new VByteArray();
            bytes.writeUIntV(2011);
            bytes.writeUIntV(0);
            bytes.writeBytes(msg, msg.position, msg.length - msg.position);
            this.user.notifyLinkClient(bytes);
        }
        this.success();
    }

    return GameLogTask;

})(TaskBase);

global.GameLogTask = GameLogTask;