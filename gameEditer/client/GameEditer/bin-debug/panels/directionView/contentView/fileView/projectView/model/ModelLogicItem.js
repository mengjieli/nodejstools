/**
 *
 * @author
 *
 */
var ModelLogicItem = (function (_super) {
    __extends(ModelLogicItem, _super);
    function ModelLogicItem() {
        _super.call(this);
        this.height = 25;
        var clickBg = new eui.Image(RES.getRes("blue"));
        this.addChild(clickBg);
        clickBg.percentWidth = 100;
        clickBg.percentHeight = 100;
        clickBg.alpha = 0;
        this.addChild(this.bg = new eui.Image(RES.getRes("blue")));
        this.bg.percentWidth = 100;
        this.bg.percentHeight = 100;
        this._label = new eui.Label();
        this._label.size = 14;
        this._label.y = 5;
        this._label.height = this.height;
        this.addChild(this._label);
        this.delButton = new ImageButton(RES.getRes("delete"));
        this.delButton.y = 5;
        this.delButton.right = 5;
        this.addChild(this.delButton);
    }
    var d = __define,c=ModelLogicItem;p=c.prototype;
    d(p, "data"
        ,function () {
            return this._data;
        }
        ,function (val) {
            this._data = val;
            this._label.text = this._data.desc;
        }
    );
    d(p, "selected"
        ,function () {
            return this._selected;
        }
        ,function (val) {
            this._selected = val;
            this.bg.visible = val;
            this.delButton.visible = val;
            if (val) {
                this.dispatchEventWith("selected", true);
            }
        }
    );
    d(p, "itemIndex"
        ,function () {
            return this._itemIndex;
        }
        ,function (val) {
            this._itemIndex = val;
        }
    );
    return ModelLogicItem;
})(eui.Component);
egret.registerClass(ModelLogicItem,"ModelLogicItem",["eui.IItemRenderer","eui.UIComponent"]);
