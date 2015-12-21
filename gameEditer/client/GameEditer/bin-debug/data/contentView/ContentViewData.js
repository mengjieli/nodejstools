/**
 *
 * @author
 *
 */
var ContentViewData = (function (_super) {
    __extends(ContentViewData, _super);
    function ContentViewData() {
        _super.call(this);
    }
    var d = __define,c=ContentViewData;p=c.prototype;
    p.viewFile = function (file) {
        var e = new ContentViewEvent(ContentViewEvent.VIEW_FILE);
        e.file = file;
        this.dispatchEvent(e);
    };
    p.closeFile = function (index) {
        var e = new ContentViewEvent(ContentViewEvent.CLOSE_FILE);
        e.index = index;
        this.dispatchEvent(e);
    };
    p.closeViewPanel = function (panel) {
        var e = new ContentViewEvent(ContentViewEvent.CLOSE_PANEL);
        e.panel = panel;
        this.dispatchEvent(e);
    };
    return ContentViewData;
})(egret.EventDispatcher);
egret.registerClass(ContentViewData,"ContentViewData");
