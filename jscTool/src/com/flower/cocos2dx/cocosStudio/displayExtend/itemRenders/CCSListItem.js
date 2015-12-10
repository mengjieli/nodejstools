var flower;
(function (flower) {
    var CCSListItem = (function (_super) {
        __extends(CCSListItem, _super);
        function CCSListItem() {
            _super.call(this);
            trace("new ccslistItem");
        }

        var d = __define, c = CCSListItem;
        p = c.prototype;

        p.setData = function (d) {
            trace("设置item:" + d.label);
            _super.prototype.setData.call(this,d);
            if (!this._label) {
                this._label = flower.TextField.create(this.data.label, 20, 0xff0000);
                this._label.setAnchorPoint(0, 0);
                this.addChild(this._label);
            }
            else  this._label.setText(this.data.label);
        }

        return CCSListItem;
    })(flower.CCSListItemBase);
    flower.CCSListItem = CCSListItem;
})(flower || (flower = {}));
