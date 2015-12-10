var flower;
(function (flower) {
    var CCSButton = (function (_super) {
        __extends(CCSButton, _super);
        //_downSkin: null,
        //_upSkin: null,
        //_disableSkin: null,
        //_curSkin: null,
        //_state: null,
        //_text: null,
        //_clickBig: null,
        function CCSButton(subClass) {
            subClass = subClass == null ? false : subClass;
            _super.call(this, true);
            this.className = flower.ClassName.CCSButton;
            if (subClass == false && flower.ClassLock.CCSButton == true) {
                flower.DebugInfo.debug("|CCSButton创建| 不能new，请改用CCSButton.create()", flower.DebugInfo.ERROR);
                return;
            }
            this._state = 0;
            this._clickBig = true;
            this.addEventListener(flower.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            this.addEventListener(flower.MouseEvent.CLICK, this.onMouseUp, this);
        }

        var d = __define, c = CCSButton;
        p = c.prototype;

        p.initBuffer = function () {
            _super.prototype.initBuffer.call(this);
            this._mouseAim = true;
            this._clickBig = true;
            this._text = CCSLabel.create("", 24, 0);
            this.addChild(this._text);
        }

        p.cycleBuffer = function () {
            if (this._downSkin) this._downSkin.dispose();
            if (this._upSkin) this._upSkin.dispose();
            if (this._disableSkin) this._disableSkin.dispose();
            if (this._text) this._text.dispose();
            this._downSkin = null;
            this._upSkin = null;
            this._disableSkin = null;
            this._curSkin = null;
            this._state = 0;
            _super.prototype.cycleBuffer.call(this);
        }

        p.setClickBig = function (val) {
            this._clickBig = val;
        }

        p.setTitleText = function (val) {
            this._text.setText(val);
        }

        p.setTitleFontSize = function (val) {
            this._text.setFontSize(val);
        }

        p.setTitleColor = function (color) {
            this._text.setColor(color);
        }

        p.loadTextureNormal = function (url, type) {
            type = type == null ? 0 : type;
            if (this._upSkin) {
                this._upSkin.dispose();
                this._upSkin = null;
            }
            this._upSkin = CCSImageView.create();
            (this._upSkin).loadTexture(url, type);
            if (this._state == 1) this._curSkin = this._upSkin;
            if (this._state == 0) this.setState(1);
        }

        p.setNormal = function (display) {
            if (this._upSkin) {
                this._upSkin.dispose();
                this._upSkin = null;
            }
            this._upSkin = display;
            if (this._state == 1) this._curSkin = this._upSkin;
            if (this._state == 0) this.setState(1);
        }

        p.setPressed = function (display) {
            if (this._downSkin) {
                this._downSkin.dispose();
                this._downSkin = null;
            }
            this._downSkin = display;
            if (this._state == 2) this._curSkin = this._curSkin;
        }

        p.loadTexturePressed = function (url, type) {
            type = type == null ? 0 : type;
            if (this._downSkin) {
                this._downSkin.dispose();
                this._downSkin = null;
            }
            this._downSkin = CCSImageView.create();
            (this._downSkin).loadTexture(url, type);
            if (this._state == 2) this._curSkin = this._curSkin;
        }

        p.setDisabled = function (display) {
            if (this._disableSkin) {
                this._disableSkin.dispose();
                this._disableSkin = null;
            }
            this._disableSkin = display;
            if (this._state == 3) this._curSkin = this._disableSkin;
        }

        p.loadTextureDisabled = function (url, type) {
            type = type == null ? 0 : type;
            if (this._disableSkin) {
                this._disableSkin.dispose();
                this._disableSkin = null;
            }
            this._disableSkin = CCSImageView.create();
            (this._disableSkin).loadTexture(url, type);
            if (this._state == 3) this._curSkin = this._disableSkin;
        }

        p.setDisplays = function (normalUrl, downUrl, disableUrl) {
            downUrl = downUrl == null ? null : downUrl;
            disableUrl = disableUrl == null ? null : disableUrl;
            this.setNormal(normalUrl);
            if (downUrl) this.setPressed(downUrl);
            if (disableUrl) this.setDisabled(disableUrl);
        }

        p.loadTextures = function (normalUrl, downUrl, disableUrl) {
            downUrl = downUrl == null ? "" : downUrl;
            disableUrl = disableUrl == null ? "" : disableUrl;
            this.loadTextureNormal(normalUrl);
            if (downUrl != "") this.loadTexturePressed(downUrl);
            if (disableUrl != "") this.loadTextureDisabled(disableUrl);
        }

        p.setTouchEnabled = function (val) {
            this.mouseEnabled = val;
        }

        p.setBright = function (val) {
            this._bright = val;
            if (this._bright == true) this.setState(1);
            else  this.setState(2);
        }

        p.dispose = function () {
            _super.prototype.dispose.call(this);
            if (this.className == flower.ClassName.CCSButton) {
                flower.BufferPool.cycle(flower.ClassName.CCSButton, this, flower.BufferPool.CCSButton);
            }
        }

        p.setOptions = function (options, myUrl) {
            _super.prototype.initBuffer.call(this, options, myUrl);
            if (this.className == flower.ClassName.CCSButton) {
                if (options.disabledData.path) this.loadTextureDisabled(flower.CCSHelp.transfromImageTexturesInfo(options.disabledData, myUrl).url, flower.CCSHelp.transfromImageTexturesInfo(options.disabledData, myUrl).type);
                if (options.normalData.path) this.loadTextureNormal(flower.CCSHelp.transfromImageTexturesInfo(options.normalData, myUrl).url, flower.CCSHelp.transfromImageTexturesInfo(options.normalData, myUrl).type);
                if (options.pressedData.path) this.loadTexturePressed(flower.CCSHelp.transfromImageTexturesInfo(options.pressedData, myUrl).url, flower.CCSHelp.transfromImageTexturesInfo(options.pressedData, myUrl).type);
                this.setTitleColor(cc.c3b(options.textColorR, options.textColorG, options.textColorB));
                this.setTitleFontSize(options.fontSize);
                this.setTitleText(options.text);
            }
        }

        p.onMouseDown = function (e) {
            this.setState(2);
        }

        p.onMouseUp = function (e) {
            this.setState(1);
        }

        p.addTouchEventListener = function (back, owner) {
            this.addEventListener(flower.MouseEvent.CLICK, back, owner);
        }

        p.setState = function (val) {
            if (this._curSkin) {
                this._curSkin.removeFromParent();
                this._curSkin = null;
            }
            this._state = val;
            if (this._state == 1) {
                this._curSkin = this._upSkin;
            }
            if (this._state == 2) {
                this._curSkin = this._downSkin;
            }
            if (this._state == 3) {
                this._curSkin = this._disableSkin;
            }
            if (this._curSkin == null) {
                this._curSkin = this._upSkin;
                if (this._state == 2 && this._clickBig) {
                    this._curSkin.setScaleX(1.2);
                    this._curSkin.setScaleY(1.2);
                }
            }
            else {
                this._curSkin.setScaleX(1);
                this._curSkin.setScaleY(1);
            }
            if (this._curSkin) this.addChildAt(this._curSkin, 0);
        }

        CCSButton.create = function () {
            flower.ClassLock.CCSButton = false;
            var btn = flower.BufferPool.create(flower.ClassName.CCSButton, CCSButton);
            flower.ClassLock.CCSButton = true;
            return btn;
        }

        return CCSButton;
    })(flower.CCSBase);
    flower.CCSButton = CCSButton;
})(flower || (flower = {}));
