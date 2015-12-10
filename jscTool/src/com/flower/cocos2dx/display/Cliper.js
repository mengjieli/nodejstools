var flower;
(function (flower) {
    var Cliper = (function (_super) {
        __extends(Cliper, _super);
        function Cliper() {
            _super.call(this, true);
            if (flower.ClassLock.Cliper == true) {
                flower.DebugInfo.debug("不能new，请访问Cliper.create()", flower.DebugInfo.ERROR);
                return;
            }
            this._show = new cc.ClippingNode();
        }

        var d = __define, c = Cliper;
        p = c.prototype;

        p.setMask = function (graphics) {
            this._mask = graphics;
            (this._show).setStencil(graphics.getShow());
        }

        p.getMask = function () {
            return this._mask;
        }

        p.drawRectMask = function (x, y, width, height) {
            if (this._mask == null) {
                this._mask = Graphics.create();
            }
            else {
                this._mask.clear();
            }
            this.setMask(this._mask);
            this._mask.drawRect(x, y, width, height);
        }

        p.drawRectMask2 = function (rect) {
            this.drawRectMask(rect.x, rect.y, rect.width, rect.height);
        }

        p.getSize = function () {
            return cc.size(this._mask.getWidth(), this._mask.getHeight());
        }

        p.dispose = function () {
            _super.prototype.dispose.call(this);
            this._show = null;
        }

        Cliper.create = function () {
            flower.ClassLock.Cliper = false;
            var cliper = new Cliper();
            flower.ClassLock.Cliper = true;
            return cliper;
        }

        return Cliper;
    })(flower.DisplayObjectContainer);
    flower.Cliper = Cliper;
})(flower || (flower = {}));
