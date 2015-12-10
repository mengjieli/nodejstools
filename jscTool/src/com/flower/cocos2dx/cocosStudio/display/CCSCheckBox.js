var flower;
(function (flower) {
    var CCSCheckBox = (function (_super) {
        __extends(CCSCheckBox, _super);
        //_onSkin: null,
        //_offSkin: null,
        //_selected: null,
        //_group: null,
        function CCSCheckBox() {
            _super.call(this, true);
            this.className = flower.ClassName.CCSCheckBox;
            if (flower.ClassLock.CCSCheckBox == true) {
                flower.DebugInfo.debug("|CCSCheckBox创建| 不能new，请改用CCSCheckBox.create()", flower.DebugInfo.ERROR);
                return;
            }
            this._selected = true;
        }

        var d = __define, c = CCSCheckBox;
        p = c.prototype;

        p.initBuffer = function () {
            _super.prototype.initBuffer.call(this);
            this.setClickBig(false);
        }

        p.cycleBuffer = function () {
            if (this._onSkin) this._onSkin.dispose();
            if (this._offSkin) this._offSkin.dispose();
            this._onSkin = null;
            this._offSkin = null;
            this._selected = true;
            _super.prototype.cycleBuffer.call(this);
        }

        p.setGroup = function (group) {
            this._group = group;
        }

        p.loadTextureSelected = function (url, type) {
            type = type == null ? 0 : type;
            if (this._onSkin) {
                this._onSkin.dispose();
                this._onSkin = null;
            }
            this._onSkin = CCSImageView.create();
            (this._onSkin).loadTexture(url, type);
            if (this._selected == true) this.addChildAt(this._onSkin, 1);
        }

        p.setSelectedDisplay = function (display) {
            if (this._onSkin) {
                this._onSkin.dispose();
                this._onSkin = null;
            }
            this._onSkin = display;
            if (this._selected == true) this.addChildAt(this._onSkin, 1);
        }

        p.loadTextureUnselected = function (url, type) {
            type = type == null ? 0 : type;
            if (this._offSkin) {
                this._offSkin.dispose();
                this._offSkin = null;
            }
            this._offSkin = CCSImageView.create();
            (this._offSkin).loadTexture(url, type);
            if (this._selected == false) this.addChildAt(this._offSkin, 1);
        }

        p.setUnselectedDisplay = function (display) {
            if (this._offSkin) {
                this._offSkin.dispose();
                this._offSkin = null;
            }
            this._offSkin = display;
            if (this._selected == false) this.addChildAt(this._offSkin, 1);
        }

        p.setSelected = function (bool) {
            if (!bool) {
                if (this._group && this._group.getSelected() == this) {
                    return;
                }
            }
            if (this._selected) {
                if (this._onSkin) this._onSkin.removeFromParent();
            }
            else {
                if (this._offSkin) this._offSkin.removeFromParent();
            }
            this._selected = bool;
            if (this._selected) {
                if (this._onSkin) this.addChildAt(this._onSkin, 1);
            }
            else {
                if (this._offSkin) this.addChildAt(this._offSkin, 1);
            }
        }

        p.getSlected = function () {
            return this._selected;
        }

        p.dispose = function () {
            _super.prototype.dispose.call(this);
            if (this.className == flower.ClassName.CCSCheckBox) {
                flower.BufferPool.cycle(flower.ClassName.CCSCheckBox, this, flower.BufferPool.CCSCheckBox);
            }
        }

        p.setOptions = function (options, myUrl) {
            _super.prototype.setOptions.call(this,options, myUrl);
            if (options.backGroundBoxSelectedData.path) this.loadTextureDisabled(flower.CCSHelp.transfromImageTexturesInfo(options.backGroundBoxSelectedData, myUrl).url, flower.CCSHelp.transfromImageTexturesInfo(options.backGroundBoxSelectedData, myUrl).type);
            if (options.backGroundBoxData.path) this.loadTextureNormal(flower.CCSHelp.transfromImageTexturesInfo(options.backGroundBoxData, myUrl).url, flower.CCSHelp.transfromImageTexturesInfo(options.backGroundBoxData, myUrl).type);
            if (options.backGroundBoxSelectedData.path) this.loadTexturePressed(flower.CCSHelp.transfromImageTexturesInfo(options.backGroundBoxSelectedData, myUrl).url, flower.CCSHelp.transfromImageTexturesInfo(options.backGroundBoxSelectedData, myUrl).type);
            if (options.frontCrossData.path) this.loadTextureSelected(flower.CCSHelp.transfromImageTexturesInfo(options.frontCrossData, myUrl).url, flower.CCSHelp.transfromImageTexturesInfo(options.frontCrossData, myUrl).type);
            if (options.frontCrossDisabledData.path) this.loadTextureUnselected(flower.CCSHelp.transfromImageTexturesInfo(options.frontCrossDisabledData, myUrl).url, flower.CCSHelp.transfromImageTexturesInfo(options.frontCrossDisabledData, myUrl).type);
            this.setSelected(options.selectedState);
        }

        p.onMouseUp = function (e) {
            _super.prototype.onMouseUp.call(this,e);
            this.setSelected(!this._selected);
            this.dispatchEvent(new flower.Event(flower.Event.CHANGE));
        }

        CCSCheckBox.create = function () {
            flower.ClassLock.CCSCheckBox = false;
            var btn = flower.BufferPool.create(flower.ClassName.CCSCheckBox, CCSCheckBox);
            flower.ClassLock.CCSCheckBox = true;
            return btn;
        }

        CCSCheckBox.addToGroup = function (name, check) {
            return CCSCheckBoxGroup.addToGroup(name, check);
        }

        return CCSCheckBox;
    })(flower.CCSButton);
    flower.CCSCheckBox = CCSCheckBox;
})(flower || (flower = {}));
