/**
 *
 * @author
 *
 */
var ViewContentTabBar = (function (_super) {
    __extends(ViewContentTabBar, _super);
    function ViewContentTabBar() {
        _super.call(this);
        var exml = "<e:Skin states=\"up,down\" height=\"25\" xmlns:e = \"http://ns.egret.com/eui\" >\n            <e:Image source.down=\"resource/images/tabYes.png\" source.up=\"resource/images/tabNo.png\" width=\"100%\" height=\"100%\"/>\n            <e:Label text=\"{data}\" size=\"14\" textColor.down=\"0xFFFFFF\" textColor.up=\"0x666666\" horizontalCenter=\"0\" verticalCenter=\"0\"/>\n            <e:Button id=\"closeBtn\" right=\"3\" verticalCenter=\"0\">\n                <e:Skin states=\"up,down,disabled\">\n                    <e:Image alpha.up=\"1.0\" alpha.down=\"0.5\" alpha.disabled=\"0.5\" source=\"resource/images/button/close.png\"/>\n                 </e:Skin>\n            </e:Button>\n        </e:Skin>";
        this.skinName = exml;
        this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
    }
    var d = __define,c=ViewContentTabBar;p=c.prototype;
    p.onClose = function (e) {
        EditerData.getInstance().conteView.closeFile(this.itemIndex);
    };
    return ViewContentTabBar;
})(eui.ItemRenderer);
egret.registerClass(ViewContentTabBar,"ViewContentTabBar");
