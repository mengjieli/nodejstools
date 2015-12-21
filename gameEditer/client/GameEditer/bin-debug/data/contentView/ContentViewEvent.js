/**
 *
 * @author
 *
 */
var ContentViewEvent = (function (_super) {
    __extends(ContentViewEvent, _super);
    function ContentViewEvent(type) {
        _super.call(this, type);
    }
    var d = __define,c=ContentViewEvent;p=c.prototype;
    ContentViewEvent.VIEW_FILE = "view_file";
    ContentViewEvent.CLOSE_FILE = "close_file";
    ContentViewEvent.CLOSE_PANEL = "close_panel";
    return ContentViewEvent;
})(egret.Event);
egret.registerClass(ContentViewEvent,"ContentViewEvent");
