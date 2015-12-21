/**
 *
 * @author
 *
 */
var UIData = (function (_super) {
    __extends(UIData, _super);
    function UIData() {
        _super.call(this);
    }
    var d = __define,c=UIData;p=c.prototype;
    p.showPanel = function (panelName) {
        this.dispatchEvent(new UIDataEvent(UIDataEvent.SHOW_PANEL, panelName));
    };
    return UIData;
})(egret.EventDispatcher);
egret.registerClass(UIData,"UIData");
