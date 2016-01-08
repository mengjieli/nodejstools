var LoadCommandConfigTask = (function (_super) {

    __extends(LoadCommandConfigTask, _super);

    function LoadCommandConfigTask(user, fromClient, cmd, msg) {
        _super.call(this, user, fromClient, cmd, msg);
    }

    var d = __define, c = LoadCommandConfigTask;
    var p = c.prototype;

    /**
     * 开始执行任务
     * @param cmd
     * @param msg
     */
    p.startTask = function (cmd, msg) {
        var txt = (new File("./data/Command.json")).readContent();
        Config.cmds = JSON.parse(txt);
        this.success();
    }

    return LoadCommandConfigTask;

})(TaskBase);

global.LoadCommandConfigTask = LoadCommandConfigTask;