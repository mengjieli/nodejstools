var flower;
(function (flower) {
    var CCSPanel = (function (_super) {
        __extends(CCSPanel, _super);
        //_bgImg: null,
        //_bgCapInsets: null,
        //_graphics: null,
        //_bgColorType: null,
        //_bgColorAlpha: null,
        //_bgColor: null,
        //_cliper: null,
        //_cliperGraphics: null,
        function CCSPanel() {
            _super.call(this, true);
            this.className = flower.ClassName.CCSPanel;
            if (flower.ClassLock.CCSPanel == true) {
                flower.DebugInfo.debug("|创建CCSPanel| 不能new，请访问CCSPanel.create()", flower.DebugInfo.ERROR);
                return;
            }
        }

        var d = __define, c = CCSPanel;
        p = c.prototype;

        p.initBuffer = function () {
            _super.prototype.initBuffer.call(this);
            this._bgColorType = 0;
            this._bgColorAlpha = 1;
        }

        p.cycleBuffer = function () {
            if (this._bgImg) this._bgImg.dispose();
            if (this._graphics) this._graphics.dispose();
            this._bgImg = null;
            this._graphics = null;
            this._bgCapInsets = null;
            this._bgColor = null;
            _super.prototype.cycleBuffer.call(this);
        }

        p.setBackGroundColor = function (startColor, endColor) {
            endColor = endColor == null ? null : endColor;
            this._bgColor = startColor;
            this.drawBg();
        }

        p.setBackGroundColorOpacity = function (val) {
            this._bgColorAlpha = val;
            this.drawBg();
        }

        p.setBackGroundColorType = function (type) {
            this._bgColorType = type;
            this.drawBg();
        }

        p.setSize = function (size) {
            _super.prototype.initBuffer.call(this,size);
            if (this._bgImg && this._bgCapInsets) {
                this._bgImg.setSize(size);
                this._bgImg.setCapInsets(this._bgCapInsets);
            }
            this.drawBg();
            this.resetPos();
            if (this._cliperGraphics) {
                this._cliperGraphics.clear();
                this._cliperGraphics.beginFill(0);
                this._cliperGraphics.drawRect(0, 0, this._width, this._height);
            }
        }

        p.setBackGroundImage = function (path, type) {
            if (this._bgImg) this._bgImg.dispose();
            this._bgImg = flower.CCSImageView.create();
            this._bgImg.setPosition2(-this._width * this._anchorX + this._width / 2, -this._height * this._anchorY + this._height / 2);
            this._bgImg.setSize(cc.size(this._width, this._height));
            this._bgImg.loadTexture(path, type);
            if (this._cliper) this._cliper.addChild(this._bgImg);
            else  this.addChild(this._bgImg);
        }

        p.setBackGroundImageCapInsets = function (rect) {
            this._bgCapInsets = rect;
            if (this._bgImg) {
                this._bgImg.setCapInsets(rect);
                this._bgImg.setPosition2(-this._width * this._anchorX, -this._height * this._anchorY);
            }
        }

        p.setAnchorPoint = function (x, y) {
            _super.prototype.dispose.call(this,x, y);
            this.resetPos();
        }

        p.resetPos = function () {
            if (this._bgImg) {
                if (this._bgCapInsets == null) this._bgImg.setPosition2(-this._width * this._anchorX + this._width / 2,
                    -this._height * this._anchorY + this._height / 2);
                else  this._bgImg.setPosition2(-this._width * this._anchorX, -this._height * this._anchorY);
            }
            if (this._graphics) {
                this._graphics.setPosition2(-this._width * this._anchorX, -this._height * this._anchorY);
            }
        }

        p.drawBg = function () {
            if (!this._graphics) {
                this._graphics = Graphics.create();
                this._graphics.setPosition2(-this._width * this._anchorX, -this._height * this._anchorY);
                this.addChildAt(this._graphics, 0);
            }
            else {
                this._graphics.clear();
            }
            this._graphics.lineStyle(0, 0, 0);
            if (this._bgColorType == 1) {
                if (this._bgColor) {
                    this._graphics.beginFill(this._bgColor.r << 16 | this._bgColor.g << 8 | this._bgColor.b, this._bgColorAlpha);
                    this._graphics.drawRect(0, 0, this._width, this._height);
                }
            }
        }

        p.setOptions = function (options, myUrl) {
            _super.prototype.dispose.call(this,options, myUrl);
            this.setBackGroundColorType(options.colorType);
            this.setBackGroundColor({r: options.bgColorR, g: options.bgColorG, b: options.bgColorB});
            this.setBackGroundColorOpacity(options.bgColorOpacity / 255);
            if (options.clipAble == true) {
                this._cliper = Cliper.create();
                this.addChild(this._cliper);
                this._cliperGraphics = Graphics.create();
                this._cliperGraphics.beginFill(0xff0000, 0.3);
                this._cliperGraphics.drawRect(0, 0, this._width, this._height);
                this._cliper.setMask(this._cliperGraphics);
            }
            if (options.backGroundImageData) {
                this.setBackGroundImage(flower.CCSHelp.transfromImageTexturesInfo(options.backGroundImageData, myUrl).url,
                    flower.CCSHelp.transfromImageTexturesInfo(options.backGroundImageData, myUrl).type);
            }
            if (options.backGroundScale9Enable) {
                this.setBackGroundImageCapInsets(cc.rect(options.capInsetsX, options.capInsetsY, options.capInsetsWidth,
                    options.capInsetsHeight));
            }
        }

        p.dispose = function () {
            _super.prototype.dispose.call(this);
            if (this.className == ClassName.CCSPanel) {
                flower.BufferPool.cycle(ClassName.CCSPanel, this, BufferPool.CCSPanel);
            }
        }

        CCSPanel.create = function () {
            flower.ClassLock.CCSPanel = false;
            var panel = flower.BufferPool.create(flower.ClassName.CCSPanel, CCSPanel);
            flower.ClassLock.CCSPanel = true;
            return panel;
        };

        return CCSPanel;
    })(flower.CCSBase);
    flower.CCSPanel = CCSPanel;
    egret.registerClass(CCSPanel, "flower.CCSPanel");
})(flower || (flower = {}));
