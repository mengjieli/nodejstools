var VarListItem = (function (_super) {
    __extends(VarListItem, _super);
    function VarListItem() {
        _super.call(this);
        this.percentHeight = 100;
        this.width = 120;
        var clickBg = new eui.Image(RES.getRes("blue"));
        this.addChild(clickBg);
        clickBg.percentWidth = 100;
        clickBg.percentHeight = 100;
        clickBg.alpha = 0;
        this.addChild(this.bg = new eui.Image(RES.getRes("blue")));
        this.bg.percentWidth = 100;
        this.bg.percentHeight = 100;
        this.label = new eui.Label();
        this.label.size = 14;
        this.label.textColor = 0xffffff;
        //        this.label.textAlign = egret.HorizontalAlign.CENTER;
        this.label.percentWidth = 100;
        this.label.percentHeight = 100;
        this.label.lineSpacing = 5;
        this.label.x = 2;
        this.label.y = 3;
        this.label.multiline = true;
        this.addChild(this.label);
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this);
    }
    var d = __define,c=VarListItem;p=c.prototype;
    p.touch = function (e) {
        this.dispatchEventWith(egret.Event.CHANGE, true);
    };
    d(p, "data"
        ,function () {
            return this._data;
        }
        ,function (val) {
            this._data = val;
            if (val) {
                this.label.text = val.desc + "\n" + val.type.desc;
            }
        }
    );
    d(p, "selected"
        ,function () {
            return this._selected;
        }
        ,function (val) {
            this._selected = val;
            this.bg.visible = val;
        }
    );
    p.setSelected = function (val) {
        this._selected = val;
    };
    d(p, "itemIndex"
        ,function () {
            return this._itemIndex;
        }
        ,function (val) {
            this._itemIndex = val;
        }
    );
    return VarListItem;
})(eui.Component);
egret.registerClass(VarListItem,"VarListItem",["eui.IItemRenderer","eui.UIComponent"]);
/**
 *
 * @author
 *
 */
var VarList = (function (_super) {
    __extends(VarList, _super);
    function VarList() {
        _super.call(this, true);
        this.itemRenderer = VarListItem;
    }
    var d = __define,c=VarList;p=c.prototype;
    return VarList;
})(List);
egret.registerClass(VarList,"VarList");
