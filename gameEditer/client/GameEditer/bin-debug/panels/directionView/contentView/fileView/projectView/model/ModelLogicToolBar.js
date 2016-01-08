/**
 *
 * @author
 *
 */
var ModelLogicToolBar = (function (_super) {
    __extends(ModelLogicToolBar, _super);
    function ModelLogicToolBar() {
        _super.call(this);
        var bg = new WinBgImage();
        bg.percentWidth = 100;
        bg.percentHeight = 100;
        this.addChild(bg);
    }
    var d = __define,c=ModelLogicToolBar;p=c.prototype;
    return ModelLogicToolBar;
})(eui.Component);
egret.registerClass(ModelLogicToolBar,"ModelLogicToolBar");
