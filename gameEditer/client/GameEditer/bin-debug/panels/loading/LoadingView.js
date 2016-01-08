/**
 *
 * @author
 *
 */
var LoadingView = (function (_super) {
    __extends(LoadingView, _super);
    function LoadingView(dispatcher) {
        _super.call(this);
        this.completeFlag = false;
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
        PopManager.pop(this, true, true, 0);
        this.alpha = 0;
        var _this = this;
        setTimeout(function () {
            if (_this.completeFlag == false) {
                _this.alpha = 1;
            }
        }, 500);
    }
    var d = __define,c=LoadingView;p=c.prototype;
    p.onStart = function (e) {
        this.titleLabel.text = e.title;
        this.tipLabel.text = e.tip;
        this.progress.value = 0;
        if (e.max) {
            this.progress.maximum = e.max;
        }
    };
    p.onProgress = function (e) {
        this.progress.value = e.progress * this.progress.maximum;
        this.tipLabel.text = e.tip;
    };
    p.onComplete = function (e) {
        this.progress.value = this.progress.maximum;
        var dispatcher = this.dispatcher;
        dispatcher.removeEventListener(LoadingEvent.START, this.onStart, this);
        dispatcher.removeEventListener(LoadingEvent.PROGRESS, this.onProgress, this);
        dispatcher.removeEventListener(LoadingEvent.COMPLETE, this.onComplete, this);
        this.parent.removeChild(this);
        this.completeFlag = true;
    };
    return LoadingView;
})(eui.Component);
egret.registerClass(LoadingView,"LoadingView");
