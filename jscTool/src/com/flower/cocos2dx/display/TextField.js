var flower;
(function (flower) {
    var TextField = (function (_super) {
        __extends(TextField, _super);

        function TextField() {
            _super.call(this, true);
            trace("新的 textfield");
            this.className = flower.ClassName.TextField;
            if (flower.ClassLock.TextField == true) {
                flower.DebugInfo.debug("|创建TextField| 创建失败，请访问TextField.create()方法创建");
                return;
            }
        }

        var d = __define, c = TextField;
        p = c.prototype;

        p.initBuffer = function () {
            this._content = "";
            _super.prototype.initBuffer.call(this);
        }

        p.cycleBuffer = function () {
            _super.prototype.cycleBuffer.call(this);
            this._show = null;
        }

        p.initTextField = function (content, size, color) {
            this._show = new cc.LabelTTF(content, "", size);
            (this._show).setString(content);
            (this._show).setFontSize(size);
            (this._show).setFontFillColor({r: color >> 16, g: color >> 8 & 0xFF, b: color & 0xFF}, true);
            var s = this._show.getContentSize();
            this._width = s.width;
            this._height = s.height;
        }

        p.setText = function (content) {
            this._content = content;
            if (null != this._show) {
                (this._show).setString(content);
                var s = this._show.getContentSize();
                if (null != s) {
                    this._width = s.width;
                    this._height = s.height;
                }
            }
        }

        p.getText = function () {
            return this._content;
        }

        p.setFontSize = function (size) {
            (this._show).setFontSize(size);
            var s = this._show.getContentSize();
            this._width = s.width;
            this._height = s.height;
        }

        p.setColor = function (color) {
            (this._show).setFontFillColor(cc.Color(color >> 16, color >> 8 & 0xFF, color & 0xFF, 255));
        }

        p.setColor2 = function (r, g, b) {
            (this._show).setColor(cc.c3b(r, g, b));
        }

        p.setBlendMode = function (val) {
            if (val == Blend.NORMAL) {
                (this._show).setBlendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            }
            else if (val == Blend.ADD) {
                (this._show).setBlendFunc(gl.ONE, gl.ONE);
            }
        }

        p.getWidth = function () {
            return (this._show).getContentSize().width;
        }

        p.getHeight = function () {
            return (this._show).getContentSize().height;
        }

        p.dispose = function () {
            if (this.incycle) {
                return;
            }
            _super.prototype.dispose.call(this);
            if (this.className == flower.ClassName.TextField) {
                flower.BufferPool.cycle(flower.ClassName.TextField, this, flower.BufferPool.TextFieldMax);
            }
        }

        TextField.create = function (content, size, color) {
            flower.ClassLock.TextField = false;
            var txt = flower.BufferPool.create(flower.ClassName.TextField, TextField);
            flower.ClassLock.TextField = true;
            txt.initTextField(content, size, color);
            return txt;
        }

        return TextField;
    })(flower.DisplayObject);
    flower.TextField = TextField;
})(flower || (flower = {}));
