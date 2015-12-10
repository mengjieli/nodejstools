var flower;
(function (flower) {
    var MoveCamera = (function (_super) {
        __extends(MoveCamera, _super);
        function MoveCamera(w, h) {
            _super.call(this, w, h);
        }

        var d = __define, c = MoveCamera;
        p = c.prototype;

        return MoveCamera;
    })(flower.CameraBase);
    flower.MoveCamera = MoveCamera;
})(flower || (flower = {}));
