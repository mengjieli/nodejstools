/**
 *
 * @author
 *
 */
var MainPanel = (function (_super) {
    __extends(MainPanel, _super);
    function MainPanel() {
        _super.call(this);
    }
    var d = __define,c=MainPanel;p=c.prototype;
    p.start = function () {
        EditerData.getInstance();
        this.addChild(new Menu());
        this.addChild(new ProjectView());
        //        PopManager.pop(new ModelAddLogicPanel(null));
    };
    p.onSaveToServer = function (e) {
        var file = new LocalFile("a.json");
        file.addEventListener(egret.Event.COMPLETE, this.onPostComplete, this);
        file.saveFile("{\"name\":\"Upload123\"}");
    };
    p.onPostComplete = function (e) {
        console.log("保存完毕");
        //        EditerData.getInstance().workDirection.flush();
    };
    return MainPanel;
})(eui.Component);
egret.registerClass(MainPanel,"MainPanel");
