var flower;
(function (flower) {
    var CameraEvent = (function (_super) {
        __extends(CameraEvent, _super);

        function CameraEvent(type) {
            _super.call(this, type);
        }

        var d = __define, c = CameraEvent;
        p = c.prototype;

        CameraEvent.MOVE = "move";
        CameraEvent.extend = extendClass;

        return CameraEvent;
    })(flower.Event);
    flower.CameraEvent = CameraEvent;

})(flower || (flower = {}));
