/**
 *
 * @author
 *
 */
var PopManager = (function (_super) {
    __extends(PopManager, _super);
    function PopManager() {
        _super.call(this);
        this.masks = {};
        PopManager.ist = this;
        this.width = Config.width;
        this.height = Config.height;
    }
    var d = __define,c=PopManager;p=c.prototype;
    p.pop = function (panel, center, mask, maskAlpha) {
        if (mask) {
            var sp = new egret.Shape();
            sp.graphics.beginFill(0, maskAlpha);
            sp.graphics.drawRect(0, 0, this.width, this.height);
            sp.graphics.endFill();
            this.addChild(sp);
            this.masks[panel.hashCode] = sp;
        }
        this.addChild(panel);
        if (mask) {
            panel.addEventListener(egret.Event.REMOVED, this.onViewRemove, this);
        }
        if (center) {
            panel.x = (this.width - panel.width) / 2;
            panel.y = (this.height - panel.height) / 2;
        }
    };
    p.onViewRemove = function (e) {
        if (e.target != e.currentTarget)
            return;
        e.currentTarget.removeEventListener(egret.Event.REMOVED, this.onViewRemove, this);
        e.currentTarget.parent.removeChild(e.currentTarget);
        if (this.masks[e.currentTarget.hashCode]) {
            this.masks[e.currentTarget.hashCode].parent.removeChild(this.masks[e.currentTarget.hashCode]);
            delete this.masks[e.currentTarget.hashCode];
        }
    };
    PopManager.pop = function (panel, center, mask, maskAlpha) {
        if (center === void 0) { center = false; }
        if (mask === void 0) { mask = false; }
        if (maskAlpha === void 0) { maskAlpha = 0.35; }
        PopManager.ist.pop(panel, center, mask, maskAlpha);
    };
    return PopManager;
})(eui.Component);
egret.registerClass(PopManager,"PopManager");
