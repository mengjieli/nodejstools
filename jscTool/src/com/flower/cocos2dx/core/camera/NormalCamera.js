var flower;
(function (flower) {
    var NormalCamera = (function (_super) {
        __extends(NormalCamera, _super);
        function NormalCamera(w, h) {
            _super.call(this, w, h);
        }

        var d = __define, c = NormalCamera;
        p = c.prototype;

        return NormalCamera;
    })(flower.CameraBase);
    flower.NormalCamera = NormalCamera;
})(flower || (flower = {}));
