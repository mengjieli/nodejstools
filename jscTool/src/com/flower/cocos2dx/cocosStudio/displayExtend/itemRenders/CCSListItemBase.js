var flower;
(function (flower) {
    //data: null,
    var CCSListItemBase = (function (_super) {
        __extends(CCSListItemBase, _super);
        function CCSListItemBase() {
            _super.call(this, true);
        }

        var d = __define, c = CCSListItemBase;
        p = c.prototype;

        p.setData = function (d) {
            this.data = d;
        }

        return CCSListItemBase;
    })(flower.DisplayObjectContainer);
    flower.CCSListItemBase = CCSListItemBase;
})(flower || (flower = {}));
