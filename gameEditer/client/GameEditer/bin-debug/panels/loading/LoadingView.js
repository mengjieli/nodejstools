/**
 *
 * @author
 *
 */
var LoadingView = (function (_super) {
    __extends(LoadingView, _super);
    function LoadingView(dispatcher) {
        _super.call(this);
        this.dispatcher = dispatcher;
        this.addChild(this.titleLabel = new eui.Label());
        this.titleLabel.text = "";
        this.titleLabel.size = 16;
        this.titleLabel.horizontalCenter = 0;
        this.addChild(this.progress = new eui.ProgressBar());
        this.progress.width = 200;
        this.progress.height = 30;
        this.progress.minimum = 0;
        this.progress.maximum = 100;
        this.progress.value = 0;
        this.progress.y = 30;
        this.progress.horizontalCenter = 0;
        this.addChild(this.tipLabel = new eui.Label());
        this.tipLabel.text = "";
        this.tipLabel.size = 14;
        this.tipLabel.y = 80;
        this.tipLabel.horizontalCenter = 0;
        dispatcher.addEventListener(LoadingEvent.START, this.onStart, this);
        dispatcher.addEventListener(LoadingEvent.PROGRESS, this.onProgress, this);
        dispatcher.addEventListener(LoadingEvent.COMPLETE, this.onComplete, this);
        PopManager.pop(this, true, true);
    }
    var d = __define,c=LoadingView;p=c.prototype;
    p.onStart = function (e) {
        this.titleLabel.text = e.title;
        this.tipLabel.text = e.tip;
        this.progress.value = 0;
    };
    p.onProgress = function (e) {
        this.progress.value = e.progress * this.progress.maximum;
        this.tipLabel.text = e.tip;
    };
    p.onComplete = function (e) {
        this.progress.value = this.progress.maximum;
        var dispatcher = this.dispatcher;
        dispatcher.addEventListener(LoadingEvent.START, this.onStart, this);
        dispatcher.addEventListener(LoadingEvent.PROGRESS, this.onProgress, this);
        dispatcher.addEventListener(LoadingEvent.COMPLETE, this.onComplete, this);
        this.parent.removeChild(this);
    };
    return LoadingView;
})(eui.Component);
egret.registerClass(LoadingView,"LoadingView");
