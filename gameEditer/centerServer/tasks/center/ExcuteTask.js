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
        //console.log("excute task back",taskId);
        if(this.user) {
            this.user.excuteTask(taskId,msg);
        } else {
            var list = User.list;
            for(var i = 0; i < list.length; i++) {
                var user = list[i];
                if(user.excuteTask(taskId,msg) == true) {
                    break;
                }
            }
        }
        this.success();
    }

    return ExcuteTask;

})(TaskBase);

global.ExcuteTask = ExcuteTask;