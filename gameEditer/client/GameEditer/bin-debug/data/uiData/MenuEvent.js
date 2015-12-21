/**
 *
 * @author
 *
 */
var MenuEvent = (function (_super) {
    __extends(MenuEvent, _super);
    function MenuEvent(type, menu) {
        _super.call(this, type);
        this.menu = "";
        this.menu = menu;
    }
    var d = __define,c=MenuEvent;p=c.prototype;
    MenuEvent.CLICK = "click";
    return MenuEvent;
})(egret.Event);
egret.registerClass(MenuEvent,"MenuEvent");
