var flower;
(function (flower) {
    var CCSLabel = (function (_super) {
        __extends(CCSLabel, _super);
        //_label: null,
        function CCSLabel() {
            _super.call(this, true);
            this.className = flower.ClassName.CCSLabel;
            if (flower.ClassLock.CCSLabel == true) {
                flower.DebugInfo.debug("|创建CCSLabel| 不能new，请访问CCSLabel.create()创建对象", flower.DebugInfo.ERROR);
                return;
            }
        }

        var d = __define, c = CCSLabel;
        p = c.prototype;

        p.init = function (content, fontSize, color) {
            this._label = flower.TextField.creat(content, fontSize, color);
            this.addChild(this._label);
            this._label.setAnchorPoint(this._anchorX, this._anchorY);
        }

        p.setAnchorPoint = function (x, y) {
            _super.prototype.dispose.call(this,x,y);
            this._label.setAnchorPoint(x, y);
        }

        p.dispose = function () {
            _super.prototype.dispose.call(this);
            if (this.className == flower.ClassName.CCSLabel) {
                flower.BufferPool.cycle(flower.ClassName.CCSLabel, this, flower.BufferPool.CCSLabel);
            }
        }

        p.setText = function (val) {
            this._label.setText(val);
        }

        p.setFontSize = function (val) {
            this._label.setFontSize(val);
        }

        p.setColor = function (val) {
            this._label.setColor2(val.r, val.g, val.b);
        }

        p.getStringValue = function () {
            return this._label.getText();
        }

        p.setOptions = function (options, myUrl) {
            _super.prototype.initBuffer.call(this,options, myUrl);
            this._label.setAnchorPoint(this._anchorX, this._anchorY);
            this._label.setFontSize(options.fontSize);
            this._label.setColor2(options.colorR, options.colorG, options.colorB);
            this._label.setText(options.text);
        }

        CCSLabel.create = function (content, fontSize, color) {
            content = content == null ? "" : content;
            fontSize = fontSize == null ? 24 : fontSize;
            color = color == null ? 0 : color;
            flower.ClassLock.CCSLabel = false;
            var label = flower.BufferPool.create(ClassName.CCSLabel, CCSLabel);
            label.init(content, fontSize, color);
            flower.ClassLock.CCSLabel = true;
            return label;
        };

        return CCSLabel;
    })(flower.CCSBase);
    flower.CCSLabel = CCSLabel;
})
(flower || (flower = {}));

