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
        this.clickBg = new egret.Shape;
        this.addChild(this.clickBg);
        var image = new eui.Image();
        image.source = source;
        this.addChild(image);
        this.image = image;
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
            this.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
        }, this);
    }
    var d = __define,c=ImageButton;p=c.prototype;
    p.validateDisplayList = function () {
        _super.prototype.validateDisplayList.call(this);
        this.clickBg.graphics.clear();
        this.clickBg.graphics.beginFill(0x555555, 0);
        this.clickBg.graphics.drawRect(0, 0, this.image.width, this.image.height);
        this.clickBg.graphics.endFill();
    };
    return ImageButton;
})(eui.Component);
egret.registerClass(ImageButton,"ImageButton");
