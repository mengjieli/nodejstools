var flower;
(function (flower) {
    var CCSLabelAtlas = (function (_super) {
        __extends(CCSLabelAtlas, _super);
        //_stringVal: null,
        //_charFile: null,
        //_itemWidth: null,
        //_itemHeight: null,
        //_startChar: null,
        //_chars: null,
        //_vals: null,
        function CCSLabelAtlas() {
            _super.call(this, true);
            this.className = flower.ClassName.CCSLabelAtlas;
            if (flower.ClassLock.CCSLabelAtlas == true) {
                flower.DebugInfo.debug("|创建CCSLabelAtlas| 不能new，请访问CCSLabelAtlas.create()获取对象", flower.DebugInfo.ERROR);
                return;
            }
            this._vals = new Array();
            cc.log("new CCSLabelAtlas");
        }

        var d = __define, c = CCSLabelAtlas;
        p = c.prototype;

        p.initBuffer = function () {
            _super.prototype.initBuffer.call(this);
            this._stringVal = "";
            this._charFile = "";
            this._itemWidth = 0;
            this._itemHeight = 0;
            this._startChar = "";
            this._chars = [];
        }

        p.cycleBuffer = function () {
            while (this._vals.length) {
                this._vals.pop().dispose();
            }
            this._chars = null;
            _super.prototype.cycleBuffer.call(this);
        }

        p.setProperty = function (stringVal, charFile, itemWidth, itemHeight, startChar) {
            this._charFile = charFile;
            this._itemWidth = itemWidth;
            this._itemHeight = itemHeight;
            this._startChar = startChar;
            flower.TextureManager.getInstance().loadTexture(this._charFile);
            var len = flower.TextureManager.getInstance().getTextureInfo(charFile).width / itemWidth;
            this._chars = [startChar];
            var second = flower.UTFChange.stringToBytes(startChar)[0];
            if (second >= 48 && second <= 58) {
                second = parseInt(startChar);
            }
            else {
                second = -1;
            }
            for (var i = 1; i < len; i++) {
                this._chars.push((second + i).toString());
            }
            this.setStringValue(stringVal);
        }

        p.setStringValue = function (val) {
            this._stringVal = val;
            while (this._vals.length) {
                this._vals[i].removeFromParent();
            }
            var start = 0;
            var char;
            for (var i = 0; i < val.length; i++) {
                for (var pos = 0; pos < this._chars.length; pos++) {
                    if (this._chars[pos] == val.charAt(i)) {
                        char = Bitmap.createSubBitmap(this._charFile, cc.rect(this._itemWidth * pos, 0, this._itemWidth, this._itemHeight),
                            cc.size(this._itemWidth, this._itemHeight));
                        this.addChild(char);
                        char.setPosition2(-this._itemWidth * this._stringVal.length * this._anchorX + i * this._itemWidth,
                            this._itemHeight * (0.5 - this._anchorY));
                        this._vals.push(char);
                    }
                }
            }
        }

        p.getStringValue = function () {
            return this._stringVal;
        }

        p.setAnchorPoint = function (x, y) {
            _super.prototype.setAnchorPoint.call(this,x,y);
            for (var i = 0; i < this._vals.length; i++) {
                this._vals[i].setPosition2(-this._itemWidth * this._stringVal.length * this._anchorX + i * this._itemWidth,
                    this._itemHeight * (0.5 - this._anchorY));
            }
        }

        p.setOptions = function (options, myUrl) {
            _super.prototype.dispose.call(this,options, myUrl);
            this.setProperty(options.stringValue, CCSHelp.transfromImageTexturesInfo(options.charMapFileData, myUrl).url,
                options.itemWidth, options.itemHeight, options.startCharMap);
        }

        p.dispose = function () {
            _super.prototype.dispose.call(this);
            if (this.className == flower.ClassName.CCSLabelAtlas) {
                flower.BufferPool.cycle(flower.ClassName.CCSLabelAtlas, this, flower.BufferPool.CCSLabelAtlas);
            }
        }

        CCSLabelAtlas.create = function (stringVal, charFile, itemWidth, itemHeight, startChar) {
            flower.ClassLock.CCSLabelAtlas = false;
            var label = flower.BufferPool.create(flower.ClassName.CCSLabelAtlas, CCSLabelAtlas);
            flower.ClassLock.CCSLabelAtlas = true;
            if (charFile != "") {
                label.setProperty(stringVal, charFile, itemWidth, itemHeight, startChar);
            }
            return label;
        }

        return CCSLabelAtlas;
    })(flower.CCSBase);
    flower.CCSLabelAtlas = CCSLabelAtlas;
})(flower || (flower = {}));

