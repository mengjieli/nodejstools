var flower;
(function (flower) {
    var InputTextField = (function (_super) {
        __extends(InputTextField, _super);

        function InputTextField() {
            trace("新的 InputTextField");
            _super.call(this, true);
            this.className = flower.ClassName.InputTextField;
            if (flower.ClassLock.InputTextField == true) {
                flower.DebugInfo.debug("|创建InputTextField| 创建失败，请访问InputTextField.create()方法创建");
                return;
            }
            this.initBuffer();
        }

        var d = __define, c = InputTextField;
        p = c.prototype;

        p.init = function (content, font, size, color, width, height) {
            this._show = new cc.TextFieldTTF();
            this._show.initWithPlaceHolder(content, {width: width, height: height}, null, font, size);
            (this._show).setColor({r: color >> 16, g: color >> 8 & 0xFF, b: color & 0xFF});
            if (IDE.TYPE == 1) {
                (this._show).setSize$(width, height);
            }
            this._width = width;
            this._height = height;
            this.addEventListener(flower.MouseEvent.MOUSE_DOWN, this.onStartInput, this);
        }

        p.onStartInput = function (e) {
            (this._show).attachWithIME();
            flower.StageCocos2DX.getInstance().addEventListener(flower.MouseEvent.MOUSE_DOWN, this.onMouseDownStage, this);
        }

        p.onMouseDownStage = function (e) {
            if (e.target != this) {
                flower.StageCocos2DX.getInstance().removeEventListener(flower.MouseEvent.MOUSE_DOWN, this.onMouseDownStage);
                (this._show).detachWithIME();
            }
        }

        p.setText = function (val) {
            (this._show).setString(val);
        }

        p.getText = function () {
            var str = (this._show).getString();
            str = str == null ? "" : str;
            return str;
        }

        p.setSecureTextEntry = function (bool) {
        }

        p.dispose = function () {
            flower.StageCocos2DX.getInstance().removeEventListener(flower.MouseEvent.MOUSE_DOWN, this.onMouseDownStage);
            _super.prototype.dispose.call(this);
        }

        InputTextField.create = function (size, color, width, height) {
            flower.ClassLock.InputTextField = false;
            var txt = new InputTextField();
            flower.ClassLock.InputTextField = true;
            txt.init("", "微软雅黑", size, color, width, height);
            return txt;
        }

        return InputTextField;
    })(flower.DisplayObject);
    flower.InputTextField = InputTextField;
})(flower || (flower = {}));
