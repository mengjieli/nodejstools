/**
 *
 * @author
 *
 */
var LogicItemNew = (function (_super) {
    __extends(LogicItemNew, _super);
    function LogicItemNew(data, item) {
        _super.call(this, data);
        this.showBorder(LogicItemBorder.RECT_VIRTUAL);
        var label = new eui.Label();
        label.text = "点击添加新逻辑";
        this.addChild(label);
        label.width = this.width;
        label.size = 14;
        label.textColor = 0xbbbbbb;
        label.x = 25;
        label.y = 30;
        var end = function () {
            label.textColor = 0xbbbbbb;
            var pos = this.localToGlobal();
            PopManager.pop(new ModelLogicTypeListPanel(pos.x + 130, pos.y, this.data, item), false, true);
        };
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            label.textColor = 0xffffff;
        }, null);
        this.addEventListener(egret.TouchEvent.TOUCH_END, end, this);
        this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, end, this);
    }
    var d = __define,c=LogicItemNew;p=c.prototype;
    return LogicItemNew;
})(LogicItemBase);
egret.registerClass(LogicItemNew,"LogicItemNew");
