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
        var image = new WinBgImage();
        this.addChild(image);
        image.percentWidth = 100;
        image.percentHeight = 100;
        var btn;
        btn = new ImageButton(RES.getRes("save"), this.clickSave, this);
        this.addChild(btn);
        btn.x = 10;
        btn.y = 8;
    }
    var d = __define,c=Menu;p=c.prototype;
    p.clickSave = function () {
        EditerData.getInstance().menu.click(MenuData.SAVE);
    };
    p.showWorkDirection = function (e) {
    };
    p.showSelectFileView = function (e) {
        PopManager.pop(new FileSelecteView(""), true);
    };
    return Menu;
})(eui.Component);
egret.registerClass(Menu,"Menu");
