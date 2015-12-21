/**
 *
 * @author
 *
 */
var ProjectDirectionItem = (function (_super) {
    __extends(ProjectDirectionItem, _super);
    function ProjectDirectionItem() {
        _super.call(this);
        this.lastClickTime = 0;
        this.addFloderBtn = new ImageButton(RES.getRes("addFloder"), this.addFloder, this);
        this.addChild(this.addFloderBtn);
        this.addFloderBtn.right = 86;
        this.addFloderBtn.y = 5;
        this.addFileBtn = new ImageButton(RES.getRes("addFile"));
        this.addChild(this.addFileBtn);
        this.addFileBtn.right = 59;
        this.addFileBtn.y = 5;
        this.freshBtn = new ImageButton(RES.getRes("refresh"));
        this.addChild(this.freshBtn);
        this.freshBtn.right = 32;
        this.freshBtn.y = 5;
        this.deleteFileBtn = new ImageButton(RES.getRes("delete"));
        this.addChild(this.deleteFileBtn);
        this.deleteFileBtn.right = 5;
        this.deleteFileBtn.y = 5;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    }
    var d = __define,c=ProjectDirectionItem;p=c.prototype;
    p.onClick = function (e) {
        var now = (new Date()).getTime();
        if (now - this.lastClickTime < 1000) {
            if (this.data.type == LocalFileType.FILE) {
            }
        }
        this.lastClickTime = now;
    };
    p.setSelected = function (val) {
        _super.prototype.setSelected.call(this, val);
        this.addFloderBtn.visible = this.addFileBtn.visible = this.freshBtn.visible = this.deleteFileBtn.visible = val;
    };
    p.addFloder = function () {
        PopManager.pop(new AddProjectDirectionPanel(this.data.more, this.data.url), true, true);
    };
    return ProjectDirectionItem;
})(DirectionViewItem);
egret.registerClass(ProjectDirectionItem,"ProjectDirectionItem");
