var LoadJSTask = (function (_super) {

    __extends(LoadJSTask, _super);

    function LoadJSTask(user, fromClient, cmd, msg) {
        _super.call(this, user, fromClient, cmd, msg);
    }

    var d = __define, c = LoadJSTask;
    var p = c.prototype;

    /**
     * 开始执行任务
     * @param cmd
     * @param msg
     */
    p.startTask = function (cmd, msg) {
        var len = msg.readUIntV();
        for (var i = 0; i < len; i++) {
            var url = msg.readUTFV();
            try {
                var content = (new File(url)).readContent();
                eval(content);
            } catch(e) {
                console.log("load js error ",url,e);
            }
        }
        this.success();
    }

    return LoadJSTask;

})(TaskBase);

global.LoadJSTask = LoadJSTask;