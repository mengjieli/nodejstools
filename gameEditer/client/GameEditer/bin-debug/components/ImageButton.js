/**
 *
 * @author
 *
 */
var ImageButton = (function (_super) {
    __extends(ImageButton, _super);
    function ImageButton(source, touchBack, touchThis) {
        if (touchBack === void 0) { touchBack = null; }
        if (touchThis === void 0) { touchThis = null; }
        _super.call(this);
        this.source = source;
        if (touchBack) {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, touchBack, touchThis);
            this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, touchBack, touchThis);
        }
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (e) {
            this.scaleX = 0.9;
            this.scaleY = 0.9;
        }, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, function (e) {
            this.scaleX = 1;
            this.scaleY = 1;
        }, this);
        this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, function (e) {
            this.scaleX = 1;
            this.scaleY = 1;
        }, this);
    }
    var d = __define,c=ImageButton;p=c.prototype;
    return ImageButton;
})(eui.Image);
egret.registerClass(ImageButton,"ImageButton");
