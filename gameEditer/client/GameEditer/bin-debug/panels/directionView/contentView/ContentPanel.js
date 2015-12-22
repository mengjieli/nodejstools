/**
 *
 * @author
 *
 */
var ContentPanel = (function (_super) {
    __extends(ContentPanel, _super);
    function ContentPanel() {
        _super.call(this);
        this.viewList = [];
        var exml = "<e:Skin xmlns:e = \"http://ns.egret.com/eui\" >\n                <e:Image width=\"100%\" height=\"100%\" source=\"resource/images/depthBlueBg.png\" scale9Grid=\"30,30,18,76\"/>\n                <e:TabBar id=\"tabBar\" dataProvider=\"{viewStack}\">\n                </e:TabBar>\n                <e:ViewStack y=\"30\" id=\"viewStack\" width=\"100%\" height=\"100%\">\n                </e:ViewStack>\n            </e:Skin>";
        this.skinName = exml;
        this.tabBar.itemRenderer = ViewContentTabBar;
        EditerData.getInstance().conteView.addEventListener(ContentViewEvent.VIEW_FILE, this.onViewFile, this);
        EditerData.getInstance().conteView.addEventListener(ContentViewEvent.CLOSE_FILE, this.onCloseFile, this);
        EditerData.getInstance().conteView.addEventListener(ContentViewEvent.CLOSE_PANEL, this.onClosePanel, this);
    }
    var d = __define,c=ContentPanel;p=c.prototype;
    p.onViewFile = function (e) {
        for (var i = 0; i < this.viewList.length; i++) {
            if (this.viewList[i].isExist(e)) {
                this.tabBar.selectedIndex = i;
                return;
            }
        }
        switch (e.file.format) {
            case LocalFileFormat.Image:
                var imageView = new ImageView(e.file);
                this.viewList.push(imageView);
                this.viewStack.addChild(imageView);
                this.viewStack.selectedIndex = this.viewList.length - 1;
                break;
            case LocalFileFormat.Json:
                var jsonView = new JsonView(e.file);
                this.viewList.push(jsonView);
                this.viewStack.addChild(jsonView);
                this.viewStack.selectedIndex = this.viewList.length - 1;
                break;
            case LocalFileFormat.Xml:
                var xmlView = new XmlView(e.file);
                this.viewList.push(xmlView);
                this.viewStack.addChild(xmlView);
                this.viewStack.selectedIndex = this.viewList.length - 1;
                break;
            case LocalFileFormat.Text:
                var textView = new TextView(e.file);
                this.viewList.push(textView);
                this.viewStack.addChild(textView);
                this.viewStack.selectedIndex = this.viewList.length - 1;
                break;
        }
    };
    p.onCloseFile = function (e) {
        var panel = this.viewList[e.index];
        this.viewList.splice(e.index, 1);
        panel.parent.removeChild(panel);
    };
    p.onClosePanel = function (e) {
        for (var i = 0; i < this.viewList.length; i++) {
            if (this.viewList[i] == e.panel) {
                this.viewList.splice(i, 1);
                e.panel.parent.removeChild(e.panel);
                break;
            }
        }
    };
    return ContentPanel;
})(eui.Component);
egret.registerClass(ContentPanel,"ContentPanel");
