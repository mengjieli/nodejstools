/**
 *
 * @author
 *
 */
var MenuData = (function (_super) {
    __extends(MenuData, _super);
    function MenuData() {
        _super.call(this);
    }
    var d = __define,c=MenuData;p=c.prototype;
    p.click = function (menu) {
        this.dispatchEvent(new MenuEvent(MenuEvent.CLICK, menu));
    };
    MenuData.SAVE = "save";
    return MenuData;
})(egret.EventDispatcher);
egret.registerClass(MenuData,"MenuData");
