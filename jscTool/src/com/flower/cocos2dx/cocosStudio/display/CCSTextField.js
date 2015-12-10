var flower;
(function (flower) {
    var CCSTextField = (function (_super) {
        __extends(CCSTextField, _super);
        //_input: null,
        function CCSTextField() {
            _super.call(this, true);
            this.className = flower.ClassName.CCSInput;
            if (flower.ClassLock.CCSInput == true) {
                flower.DebugInfo.debug("|创建CCSInput| 不能new，请访问CCSInput.create()创建对象", flower.DebugInfo.ERROR);
                return;
            }
            this.initBuffer();
        }

        var d = __define, c = CCSTextField;
        p = c.prototype;

        p.init = function (width, height, fontSize, color) {
            this._input = flower.InputTextField.create(fontSize, color, width, height);
            this.addChild(this._input);
            this._input.setAnchorPoint(this._anchorX, this._anchorY);
        }

        p.setAnchorPoint = function (x, y) {
            _super.prototype.initBuffer.call(this,x, y);
            if (this._input) this._input.setAnchorPoint(x, y);
        }

        p.getStringValue = function () {
            return this._input.getText();
        }

        p.setStringValue = function (val) {
            this._input.setText(val);
        }

        p.setOptions = function (options, myUrl) {
            _super.prototype.initBuffer.call(this,options, myUrl);
            this.init(options.width, options.height, options.fontSize, options.colorR << 16 | options.colorG << 8 | options.colorB);
            this._input.setAnchorPoint(this._anchorX, this._anchorY);
            this._input.setText(options.placeHolder);
        }

        CCSTextField.create = function (width, height, fontSize, color) {
            flower.ClassLock.CCSTextField = false;
            var label = new CCSTextField();
            flower.ClassLock.CCSTextField = true;
            if (width != 0) label.init(width, height, fontSize, color);
            return label;
        };

        return CCSTextField;
    })(flower.CCSBase);
    flower.CCSTextField = CCSTextField;
})(flower || (flower = {}));
