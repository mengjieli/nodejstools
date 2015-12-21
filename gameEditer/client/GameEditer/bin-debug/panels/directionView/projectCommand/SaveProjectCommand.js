/**
 *
 * @author
 *
 */
var SaveProjectCommand = (function () {
    function SaveProjectCommand(data) {
        var dispatcher = new egret.EventDispatcher();
        new LoadingView(dispatcher);
        var loadingEvent = new LoadingEvent(LoadingEvent.START);
        loadingEvent.title = "保存项目中";
        dispatcher.dispatchEvent(loadingEvent);
        loadingEvent = new LoadingEvent(LoadingEvent.PROGRESS);
        loadingEvent.progress = 1;
        dispatcher.dispatchEvent(loadingEvent);
        console.log("save project:", Config.workFile + "/" + data.configURL);
        var file = new LocalFile(Config.workFile + "/" + data.configURL);
        file.saveFile(JSON.stringify(data.encodeConfig()));
        file.addEventListener(egret.Event.COMPLETE, function (e) {
            dispatcher.dispatchEvent(new LoadingEvent(LoadingEvent.COMPLETE));
            file.dispose();
        }, null);
    }
    var d = __define,c=SaveProjectCommand;p=c.prototype;
    return SaveProjectCommand;
})();
egret.registerClass(SaveProjectCommand,"SaveProjectCommand");