/**
 *
 * @author
 *
 */
var UIDataEvent = (function (_super) {
    __extends(UIDataEvent, _super);
    function UIDataEvent(type, name) {
        _super.call(this, type);
        this.name = name;
    }
    var d = __define,c=UIDataEvent;p=c.prototype;
    UIDataEvent.SHOW_PANEL = "show_panel";
    return UIDataEvent;
})(egret.Event);
egret.registerClass(UIDataEvent,"UIDataEvent");
