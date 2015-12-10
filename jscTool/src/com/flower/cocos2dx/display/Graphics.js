var flower;
(function (flower) {
    var Graphics = (function (_super) {
        __extends(Graphics, _super);

        function Graphics() {
            _super.call(this, true);
            this.className = flower.ClassName.Bitmap;
            if (flower.ClassLock.Graphics == true) {
                flower.DebugInfo.debug("|创建Graphics| 创建失败，请访问Graphics.create()方法创建", flower.DebugInfo.ERROR);
                return;
            }
        }

        var d = __define, c = Graphics;
        p = c.prototype;

        p.initBuffer = function () {
            _super.prototype.initBuffer.call(this);
            this._noCotent = true;
            this._lineStroke = 1;
            this._fillColor = {r:0,g:0,b:0,a:0};
            this._lineColor = {r:0,g:0,b:0,a:1};
            this._anchorX = 0;
            this._anchorY = 0;
            this._show = new cc.DrawNode();//flower.BufferPool.createCCNode(flower.ClassName.CCDrawNode);
        }

        p.cycleBuffer = function () {
            //(this._show).clear();
            //this._show.removeFromParent();
            //flower.BufferPool.cycyleCCNode(this._show, flower.ClassName.CCDrawNode);
            this._show = null;
            this._fillColor = null;
            this._lineColor = null;
            this._lineStroke = 0;
            _super.prototype.cycleBuffer.call(this);
        }

        p.lineStyle = function (stroke, color, alpha) {
            color = color == null ? 0 : color;
            alpha = alpha == null ? 1 : alpha;
            this._lineStroke = stroke;
            this._lineColor.r = (color >> 16);
            this._lineColor.g = (color >> 8 & 0xFF);
            this._lineColor.b = (color & 0xFF);
            this._lineColor.a = alpha * 255;
        }

        p.beginFill = function (color, alpha) {
            alpha = alpha == null ? 1 : alpha;
            this._fillColor.r = (color >> 16);
            this._fillColor.g = (color >> 8 & 0xFF);
            this._fillColor.b = (color & 0xFF);
            this._fillColor.a = alpha * 255;
        }

        p.drawRect = function (x, y, width, height) {
            (this._show).drawPoly([cc.p(x, y), cc.p(x + width, y), cc.p(x + width, y + height), cc.p(x, y + height)], this._fillColor, this._lineStroke, this._lineColor);
            if (this._noCotent) {
                this._moveX = width > 0 ? x : (x - width);
                this._moveY = height > 0 ? y : (y - height);
                this._noCotent = false;
                this._width = width > 0 ? width : -width;
                this._height = height > 0 ? height : -height;
            }
            else {
                var ex = this._moveX + this._width;
                var ey = this._moveY + this._height;
                var gbx = width > 0 ? x : (x - width);
                var gby = height > 0 ? y : (y - height);
                var gex = gbx + (width > 0 ? width : -width);
                var gey = gby + (height > 0 ? height : -height);
                if (gbx < this._moveX) this._moveX = gbx;
                if (gby < this._moveY) this._moveY = gby;
                if (gex > ex) ex = gex;
                if (gey > ey) ey = gey;
                this._width = ex - this._moveX;
                this._height = ey - this._moveY;
            }
        }

        p.clear = function () {
            (this._show).clear();
            this._fillColor = {r:0,g:0,b:0,a:0};
            this._lineColor = {r:0,g:0,b:0,a:1};
            this._lineStroke = 1;
            this._moveX = 0;
            this._moveY = 0;
        }

        p.setAnchorPoint = function (x, y) {
            DebugInfo.debug("不可设置graphics的锚点");
            return;
        }

        p.dispose = function () {
            _super.prototype.dispose.call(this);
            flower.BufferPool.cycle(flower.ClassName.Graphics, this, flower.BufferPool.GraphicsMax);
        }

        Graphics.create = function () {
            flower.ClassLock.Graphics = false;
            var shape = flower.BufferPool.create(flower.ClassName.Graphics, flower.Graphics);
            flower.ClassLock.Graphics = true;
            return shape;
        }

        return Graphics;
    })(flower.DisplayObject);
    flower.Graphics = Graphics;
})(flower || (flower = {}));
