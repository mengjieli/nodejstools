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
        this.addFileBtn = new ImageButton(RES.getRes("addFile"), this.addFile, this);
        this.addChild(this.addFileBtn);
        this.addFileBtn.right = 59;
        this.addFileBtn.y = 5;
        this.freshBtn = new ImageButton(RES.getRes("refresh"));
        this.addChild(this.freshBtn);
        this.freshBtn.right = 32;
        this.freshBtn.y = 5;
        this.deleteBtn = new ImageButton(RES.getRes("delete"));
        this.addChild(this.deleteBtn);
        this.deleteBtn.right = 5;
        this.deleteBtn.y = 5;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    }
    var d = __define,c=ProjectDirectionItem;p=c.prototype;
    p.setData = function (val) {
        _super.prototype.setData.call(this, val);
        if (this.data) {
            this.changeStatusWidthButtons();
        }
    };
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
        this.changeStatusWidthButtons();
    };
    p.changeStatusWidthButtons = function () {
        if (this.data == null || this.selected == false) {
            this.addFloderBtn.visible = this.addFileBtn.visible = this.freshBtn.visible = this.deleteBtn.visible = false;
        }
        else {
            var names = ["addFloder", "addFile", "fresh", "delete"];
            var flags = [true, true, true, true];
            names.reverse();
            flags.reverse();
            var parent = this.data;
            var more2 = parent.more2;
            while (!more2) {
                parent = parent.parent;
                more2 = parent.more2;
            }
            for (var i = 0; i < names.length; i++) {
                flags[i] = more2[names[i]];
            }
            if (this.data.more2) {
                flags[0] = false;
            }
            var index = 0;
            for (i = 0; i < names.length; i++) {
                var btn = this[names[i] + "Btn"];
                btn.visible = flags[i];
                if (flags[i]) {
                    btn.right = 5 + index * 27;
                    index++;
                }
            }
        }
    };
    p.addFloder = function () {
        PopManager.pop(new AddProjectDirectionPanel(this.data.more, this.data), true, true);
    };
    p.addFile = function () {
        PopManager.pop(new AddProjectFilePanel(this.data.more, this.data), true, true);
    };
    return ProjectDirectionItem;
})(DirectionViewItem);
egret.registerClass(ProjectDirectionItem,"ProjectDirectionItem");
