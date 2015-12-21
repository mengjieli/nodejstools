/**
 *
 * @author
 *
 */
var AlertPanel = (function (_super) {
    __extends(AlertPanel, _super);
    function AlertPanel(content, title, sureLabel, sureBack, sureThis, cancleLabel, cancleBack, cancleThis) {
        if (title === void 0) { title = "提示"; }
        if (sureLabel === void 0) { sureLabel = ""; }
        if (sureBack === void 0) { sureBack = null; }
        if (sureThis === void 0) { sureThis = null; }
        if (cancleLabel === void 0) { cancleLabel = ""; }
        if (cancleBack === void 0) { cancleBack = null; }
        if (cancleThis === void 0) { cancleThis = null; }
        _super.call(this);
        this.width = 400;
        this.height = 300;
        var button;
        if (sureLabel && sureLabel != "") {
            button = new eui.Button();
            button.width = 70;
            button.height = 30;
            button.label = "确定";
            this.addChild(button);
            button.bottom = 5;
            this.sure = button;
            this.sure.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                this.parent.removeChild(this);
                if (sureBack) {
                    sureBack.apply(sureThis);
                }
            }, this);
        }
        if (cancleLabel && cancleLabel != "") {
            button = new eui.Button();
            button.width = 70;
            button.height = 30;
            button.label = "取消";
            this.addChild(button);
            button.bottom = 5;
            this.cancle = button;
            this.cancle.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                this.parent.removeChild(this);
                if (cancleBack) {
                    cancleBack.apply(cancleThis);
                }
            }, this);
        }
        if (this.sure && this.cancle) {
            this.sure.horizontalCenter = -60;
            this.cancle.horizontalCenter = 60;
        }
        else if (this.sure) {
            this.sure.horizontalCenter = 0;
        }
        else if (this.cancle) {
            this.cancle.horizontalCenter = 0;
        }
        this.title = title;
        this.addChild(this.content = new eui.Label());
        this.content.y = 30;
        this.content.size = 14;
        this.content.textColor = 0;
        this.content.text = content;
        this.content.maxWidth = this.width;
        this.content.lineSpacing = 3;
        this.content.wordWrap = true;
        this.content.multiline = true;
        this.content.verticalCenter = 0;
        this.content.horizontalCenter = 0;
        PopManager.pop(this, true, true);
    }
    var d = __define,c=AlertPanel;p=c.prototype;
    return AlertPanel;
})(eui.Panel);
egret.registerClass(AlertPanel,"AlertPanel");
