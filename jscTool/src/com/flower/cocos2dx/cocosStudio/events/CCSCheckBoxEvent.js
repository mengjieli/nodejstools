var flower;
(function (flower) {
    var CCSCheckBoxEvent = (function (_super) {
        __extends(CCSCheckBoxEvent, _super);
        function CCSCheckBoxEvent(type, selected, selectedIndex) {
            _super.call(this, type);
            this.selected = selected;
            this.selectedIndex = selectedIndex;
        }

        var d = __define, c = CCSCheckBoxEvent;
        p = c.prototype;

        CCSCheckBoxEvent.SELECTED = "selected";
        CCSCheckBoxEvent.extend = extendClass;

        return CCSCheckBoxEvent;
    })(flower.Event);
    flower.CCSCheckBoxEvent = CCSCheckBoxEvent;
})(flower || (flower = {}));
