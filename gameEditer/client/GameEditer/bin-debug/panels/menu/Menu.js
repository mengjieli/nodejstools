/**
 *
 * @author
 *
 */
var Menu = (function (_super) {
    __extends(Menu, _super);
    function Menu() {
        _super.call(this);
        this.width = Config.width;
        this.height = 30;
        var image = new eui.Image();
        image.source = "resource/images/blue2.png";
        this.addChild(image);
        image.percentWidth = 100;
        image.percentHeight = 100;
        var btn;
        btn = new ImageButton(RES.getRes("save"), this.clickSave, this);
        this.addChild(btn);
        btn.x = 5;
        btn.y = 5;
    }
    var d = __define,c=Menu;p=c.prototype;
    p.clickSave = function () {
        EditerData.getInstance().menu.click(MenuData.SAVE);
    };
    p.showWorkDirection = function (e) {
    };
    p.showSelectFileView = function (e) {
        PopManager.pop(new FileSelecteView(Config.workFile), true);
    };
    return Menu;
})(eui.Component);
egret.registerClass(Menu,"Menu");
