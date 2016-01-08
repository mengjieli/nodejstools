/**
 * 转发任务
 */
var TransTask = (function (_super) {

    __extends(TransTask, _super);

    function TransTask(user, fromClient, cmd, msg) {
        _super.call(this, user, fromClient, cmd, msg);
    }

    var d = __define, c = TransTask;
    var p = c.prototype;

    /**
     * 开始执行任务
     * @param cmd
     * @param msg
     */
    p.startTask = function (cmd, msg) {
        this.user.transMessage()
    }

    return TransTask;

})(TaskBase);

global.TransTask = TransTask;