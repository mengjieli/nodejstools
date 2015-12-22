/**
 *
 * @author
 *
 */
var WinBgImage = (function (_super) {
    __extends(WinBgImage, _super);
    function WinBgImage(type) {
        if (type === void 0) { type = 1; }
        _super.call(this);
        if (type == 1) {
            this.source = RES.getRes("blue2");
            this.scale9Grid = new egret.Rectangle(10, 10, 54, 23);
        }
        else if (type == 2) {
            this.source = RES.getRes("depthBlueBg");
            this.scale9Grid = new egret.Rectangle(30, 30, 18, 76);
        }
    }
    var d = __define,c=WinBgImage;p=c.prototype;
    return WinBgImage;
})(eui.Image);
egret.registerClass(WinBgImage,"WinBgImage");
