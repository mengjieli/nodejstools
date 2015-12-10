var CommandManager = function () {
    if (CommandManager.instance) {
        GameSDK.Error.throw("CommandManager 已经初始化过了");
        return;
    }
    CommandManager.instance = this;
}

CommandManager.prototype.excute = function (cls, data) {

}

CommandManager.instance = null;

CommandManager.getInstance = function () {
    return CommandManager.instance;
}