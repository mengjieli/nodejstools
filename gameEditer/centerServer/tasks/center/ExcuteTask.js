var ExcuteTask = (function (_super) {

    __extends(ExcuteTask, _super);

    function ExcuteTask(user, fromClient, cmd, msg) {
        _super.call(this, user, fromClient, cmd, msg);
    }

    var d = __define, c = ExcuteTask;
    var p = c.prototype;

    /**
     * 开始执行任务
     * @param cmd
     * @param msg
     */
    p.startTask = function (cmd, msg) {
        var taskId = msg.readUIntV();
        this.user.excuteTask(taskId,msg);
        this.success();
    }

    return ExcuteTask;

})(TaskBase);

global.ExcuteTask = ExcuteTask;