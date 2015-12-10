var flower;
(function (flower) {
    var CameraBase = (function (_super) {
        __extends(CameraBase, _super);
        function CameraBase(w, h) {
            this._x = 0;
            this._y = 0;
            this._width = 0;
            this._height = 0;
            this._scaleX = 1;
            this._scaleY = 1;
            this._rotation = 0;
            _super.call(this, true, true);
            this._matrix = new Matrix();
            this._colorTransform = new ColorTransform();
        }

        var d = __define, c = CameraBase;
        p = c.prototype;

        p.loadMatrix = function () {
            this._matrix.identity();
            this._matrix.prependTranslation(this._x, this._y);
            this._matrix.prependRotation(this._rotation);
            this._matrix.prependScale(this._scaleX, this._scaleY);
        }

        p.loadMouseMatrix = function (mouseX, mouseY) {
            this._matrix.identity();
            this._matrix.translate(mouseX - this._x, mouseY - this._y);
            this._matrix.rotate(-this._rotation);
            this._matrix.scale(1 / this._scaleX, 1 / this._scaleY);
            trace("load mouse matrix : ",mouseX,mouseY);
        }

        p.setX = function (val) {
            this._x = val;
            this.dispatchEvent(new CameraEvent(CameraEvent.MOVE));
        }

        p.getX = function () {
            return this._x;
        }

        p.setY = function (val) {
            this._y = val;
            this.dispatchEvent(new CameraEvent(CameraEvent.MOVE));
        }

        p.getY = function () {
            return this._y;
        }

        p.setWidth = function (val) {
            this._width = val;
        }

        p.getWidth = function () {
            return this._width;
        }

        p.setHeight = function (val) {
            this._height = val;
        }

        p.getHeight = function () {
            return this._height;
        }

        p.setScaleX = function (val) {
            this._scaleX = val;
        }

        p.getScaleX = function () {
            return this._scaleX;
        }

        p.setScaleY = function (val) {
            this._scaleY = val;
        }

        p.getScaleY = function () {
            return this._scaleY;
        }

        p.setRotation = function (val) {
            this._rotation = val;
        }

        p.getRotation = function () {
            return this._rotation;
        }

        p.getMatrix = function () {
            return this._matrix;
        }

        p.getColorTransform = function () {
            return this._colorTransform;
        }

        return CameraBase;
    })(flower.EventDispatcher);
    flower.CameraBase = CameraBase;

})(flower || (flower = {}));

