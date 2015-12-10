var flower;
(function (flower) {
    var CCSInput = (function (_super) {
        //_input: null,
        __extends(CCSInput, _super);
        function CCSInput() {
            _super.call(this, true);
            this.className = flower.ClassName.CCSInput;
            if (flower.ClassLock.CCSInput == true) {
                flower.DebugInfo.debug("|创建CCSInput| 不能new，请访问CCSInput.create()创建对象", flower.DebugInfo.ERROR);
                return;
            }
            this.initBuffer();
        }

        var d = __define, c = CCSInput;
        p = c.prototype;

        p.init = function (width, height, fontSize, color) {
            this._input = InputTextField.create(fontSize, color, width, height);
            this.addChild(this._input);
            this._input.setAnchorPoint(this._anchorX, this._anchorY);
        }

        p.setAnchorPoint = function (x, y) {
            _super.prototype.setAnchorPoint.call(this,x,y);
            if (this._input) this._input.setAnchorPoint(x, y);
        }

        p.setStringValue = function (val) {
            this._input.setText(val);
        }

        p.getStringValue = function () {
            return this._input.getText();
        }

        p.setOptions = function (options, myUrl) {
            _super.prototype.setOptions.call(this,options, myUrl);
            this.init(options.width, options.height, options.fontSize, options.colorR << 16 | options.colorG << 8 | options.colorB);
            this._input.setAnchorPoint(this._anchorX, this._anchorY);
            this._input.setText(options.placeHolder);
        }

        CCSInput.create = function (width, height, fontSize, color) {
            flower.ClassLock.CCSInput = false;
            var label = new CCSInput();
            flower.ClassLock.CCSInput = true;
            if (width != 0) label.init(width, height, fontSize, color);
            return label;
        };

        return CCSInput;
    })(flower.CCSBase);
    flower.CCSInput = CCSInput;
})(flower || (flower = {}));
