var DropDownListItem = (function (_super) {
    __extends(DropDownListItem, _super);
    function DropDownListItem() {
        _super.call(this);
        this.percentWidth = 100;
        this.height = 20;
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
        this.label.textColor = 0;
        this.label.height = 20;
        this.label.textAlign = egret.VerticalAlign.MIDDLE;
        this.addChild(this.label);
    }
    var d = __define,c=DropDownListItem;p=c.prototype;
    d(p, "data"
        ,function () {
            return this._data;
        }
        ,function (val) {
            this._data = val;
            if (val) {
                this.label.text = val.label;
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
    return DropDownListItem;
})(eui.Component);
egret.registerClass(DropDownListItem,"DropDownListItem",["eui.IItemRenderer","eui.UIComponent"]);
/**
 *
 * @author
 *
 */
var DropDownList = (function (_super) {
    __extends(DropDownList, _super);
    function DropDownList(width, height) {
        _super.call(this);
        this.width = width;
        this.height = height;
        var label = new eui.Label;
        this.addChild(label);
        label.border = true;
        label.textAlign = egret.VerticalAlign.MIDDLE;
        label.backgroundColor = 0x444444;
        label.background = true;
        label.textColor = 0xffffff;
        label.size = 14;
        label.percentWidth = 100;
        label.height = 20;
        this.label = label;
        this.btn = new ImageButton(RES.getRes("floderOpen"));
        this.addChild(this.btn);
        this.btn.y = 5;
        this.btn.right = 3;
        this.btn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onShowList, this);
        var shape = new egret.Shape();
        this.addChild(shape);
        this.list = new eui.List();
        this.list.itemRenderer = DropDownListItem;
        this.list.y = 20;
        this.list.percentWidth = 100;
        this.list.height = height - this.list.y;
        this.list.visible = false;
        this.list.addEventListener(egret.Event.CHANGE, this.onIndexChange, this);
        this.addChild(this.list);
        shape.y = this.list.y;
        shape.graphics.beginFill(0xcccccc);
        shape.graphics.drawRect(0, 0, this.width, this.list.height);
        shape.graphics.endFill();
        shape.visible = false;
        this.listBg = shape;
    }
    var d = __define,c=DropDownList;p=c.prototype;
    d(p, "dataProvider"
        ,function () {
            return this.list.dataProvider;
        }
        ,function (data) {
            this.list.dataProvider = data;
            if (data.length == 0)
                return;
            this.list.selectedIndex = 0;
            this.label.text = this.list.selectedItem.label;
        }
    );
    d(p, "selectIndex"
        ,function () {
            return this.list.selectedIndex;
        }
        ,function (index) {
            this.list.selectedIndex = index;
            this.label.text = this.list.selectedItem.label;
        }
    );
    d(p, "selectedItem"
        ,function () {
            return this.list.selectedItem;
        }
    );
    p.onShowList = function (e) {
        this.list.visible = !this.list.visible;
        this.listBg.visible = this.list.visible;
    };
    p.onIndexChange = function (e) {
        this.label.text = this.list.selectedItem.label;
        if (this.list.visible) {
            this.list.visible = !this.list.visible;
            this.listBg.visible = this.list.visible;
        }
        this.dispatchEventWith(egret.Event.CHANGE);
    };
    return DropDownList;
})(eui.Component);
egret.registerClass(DropDownList,"DropDownList");
