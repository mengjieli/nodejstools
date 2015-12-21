/**
 *
 * @author
 *
 */
var DirectionViewItem = (function (_super) {
    __extends(DirectionViewItem, _super);
    function DirectionViewItem() {
        _super.call(this);
        this.percentWidth = 100;
        this.height = 25;
        var clickBg = new eui.Image(RES.getRes("blue"));
        this.addChild(clickBg);
        clickBg.percentWidth = 100;
        clickBg.percentHeight = 100;
        clickBg.alpha = 0;
        this.addChild(this.bg = new eui.Image(RES.getRes("blue")));
        this.bg.percentWidth = 100;
        this.bg.percentHeight = 100;
        this.addChild(this.container = new egret.Sprite());
        this.btnOpen = new eui.Image(RES.getRes("floderOpen"));
        this.addChild(this.btnOpen);
        this.btnOpen.y = 7;
        this.btnOpen.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchOpen, this);
        this.btnClose = new eui.Image(RES.getRes("floderClose"));
        this.btnClose.y = 7;
        this.addChild(this.btnClose);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchClose, this);
        this.icon = new eui.Image();
        this.icon.y = 5;
        this.container.addChild(this.icon);
        this.label = new eui.Label();
        this.label.size = 14;
        this.label.textColor = 0xffffff;
        this.container.addChild(this.label);
        this.label.x = 20;
        this.label.y = 7;
    }
    var d = __define,c=DirectionViewItem;p=c.prototype;
    p.onTouchOpen = function (e) {
        this.data.status = "close";
        this.data.dataList.dispatchEvent(new egret.Event(eui.CollectionEventKind.UPDATE, true));
    };
    p.onTouchClose = function (e) {
        this.data.status = "open";
        this.data.dataList.dispatchEventWith(eui.CollectionEventKind.UPDATE);
    };
    d(p, "data"
        ,function () {
            return this._data;
        }
        ,function (val) {
            this._data = val;
            if (val == null)
                return;
            this.container.x = val.depth * 20 + 3;
            this.btnClose.x = this.btnOpen.x = val.depth * 20 + 5;
            var openThis = true;
            var node = this._data.parent;
            while (node) {
                if (node.status == "close") {
                    openThis = false;
                    break;
                }
                node = node.parent;
            }
            if (openThis) {
                this.visible = true;
                this.height = 25;
                if (val.type == LocalFileType.DIRECTION) {
                    if (val.status == "open") {
                        this.icon.bitmapData = RES.getRes("folder_open");
                        this.btnClose.visible = false;
                        this.btnOpen.visible = true;
                    }
                    else if (val.status == "close") {
                        this.icon.bitmapData = RES.getRes("folder");
                        this.btnClose.visible = true;
                        this.btnOpen.visible = false;
                    }
                    this.container.x += 20;
                }
                else if (val.type == LocalFileType.FILE) {
                    if (val.hasFloder) {
                        this.container.x += 20;
                    }
                    this.btnClose.visible = this.btnOpen.visible = false;
                    var end = this.data.format;
                    if (end == LocalFileFormat.Image) {
                        end = this.data.end;
                    }
                    var endImage = DirectionViewItem.EndImage[end];
                    if (endImage) {
                        this.icon.source = RES.getRes(endImage);
                    }
                    else {
                        this.icon.source = RES.getRes("unknown");
                    }
                }
                this.label.text = val.name;
            }
            else {
                this.visible = false;
                this.height = 0;
            }
        }
    );
    d(p, "selected"
        ,function () {
            return this._selected;
        }
        ,function (val) {
            this.setSelected(val);
        }
    );
    p.setSelected = function (val) {
        this._selected = val;
        this.bg.visible = val;
    };
    d(p, "itemIndex"
        ,function () {
            return this._itemIndex;
        }
        ,function (val) {
            this._itemIndex = val;
        }
    );
    DirectionViewItem.EndImage = {
        "json": "json",
        "xml": "xml",
        "png": "png",
        "jpg": "jpg",
        "text": "text"
    };
    return DirectionViewItem;
})(eui.Component);
egret.registerClass(DirectionViewItem,"DirectionViewItem",["eui.IItemRenderer","eui.UIComponent"]);
