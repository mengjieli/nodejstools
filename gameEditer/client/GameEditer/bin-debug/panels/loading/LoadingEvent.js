/**
 *
 * @author
 *
 */
var LoadingEvent = (function (_super) {
    __extends(LoadingEvent, _super);
    function LoadingEvent(type) {
        _super.call(this, type);
        this.title = "";
        this.tip = "";
        /**
         * 进度 0 - 1
         */
        this.progress = 0;
        this.max = 0;
    }
    var d = __define,c=LoadingEvent;p=c.prototype;
    LoadingEvent.START = "start";
    LoadingEvent.PROGRESS = "progress";
    LoadingEvent.COMPLETE = "complete";
    return LoadingEvent;
})(egret.Event);
egret.registerClass(LoadingEvent,"LoadingEvent");
