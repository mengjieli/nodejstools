var LoadUserConfigTask = (function (_super) {

    __extends(LoadUserConfigTask, _super);

    function LoadUserConfigTask(user, fromClient, cmd, msg) {
        _super.call(this, user, fromClient, cmd, msg);
    }

    var d = __define, c = LoadUserConfigTask;
    var p = c.prototype;

    /**
     * 开始执行任务
     * @param cmd
     * @param msg
     */
    p.startTask = function (cmd, msg) {
        var txt = (new File("./data/User.json")).readContent();
        Config.initUsers(JSON.parse(txt));
        this.success();
    }

    return LoadUserConfigTask;

})(TaskBase);

global.LoadUserConfigTask = LoadUserConfigTask;