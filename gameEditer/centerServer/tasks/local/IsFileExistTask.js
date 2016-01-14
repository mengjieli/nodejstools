var IsFileExistTask = (function (_super) {

    __extends(IsFileExistTask, _super);

    function IsFileExistTask(user, fromClient, cmd, msg) {
        _super.call(this, user, fromClient, cmd, msg);
    }

    var d = __define, c = IsFileExistTask;
    var p = c.prototype;

    /**
     * 开始执行任务
     * @param cmd
     * @param msg
     */
    p.startTask = function (cmd, msg) {

    }

    return IsFileExistTask;

})(TaskBase);

global.IsFileExistTask = IsFileExistTask;