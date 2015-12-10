var flower;
(function (flower) {
    var CCSImageView = (function (_super) {
        __extends(CCSImageView, _super);
        //_textureType: null,
        //_textureUrl: null,
        //_imgs: null,
        //_capInsets: null,
        function CCSImageView() {
            _super.call(this, true);
            this.className = flower.ClassName.CCSImageView;
            if (flower.ClassLock.CCSImageView == true) {
                flower.DebugInfo.debug("|创建CCSImageView| 不能new，请访问CCSImageView.create()", flower.DebugInfo.ERROR);
                return;
            }
            this._imgs = new Array();
        }

        var d = __define, c = CCSImageView;
        p = c.prototype;

        p.cycleBuffer = function () {
            while (this._imgs.length) {
                this._imgs.pop().dispose();
            }
            this._capInsets = null;
            this._textureType = 0;
            _super.prototype.cycleBuffer.call(this);
        }

        p.loadTexture = function (url, type, plistUrl) {
            type = type == null ? 0 : type;
            plistUrl = plistUrl == null ? "" : plistUrl;
            while (this._imgs.length) {
                this._imgs.pop().dispose();
            }
            if (this._childs.length) {
                this.removeAllChilds();
            }
            this._textureType = type;
            this._textureUrl = url;
            if (type == 1 && plistUrl != "") {
                PlistManager.getInstance().addPlist(plistUrl);
            }
            if (this._capInsets) {
                this.loadScale9();
            }
            else {
                while (this._imgs.length) {
                    this._imgs.pop().dispose();
                }
                var img;
                if (type == 0) img = flower.Bitmap.create(url);
                else if (type == 1) img = flower.Bitmap.createPlistFrame(url);
                img.setAnchorPoint(this._anchorX, this._anchorY);
                this.addChild(img);
                if (this._width == 0) this._width = img.getSourceWidth();
                if (this._height == 0) this._height = img.getSourceHeight();
                this._imgs.push(img);
            }
        }

        p.setCapInsets = function (rect) {
            this._capInsets = rect;
            this.loadScale9();
        }

        p.setAnchorPoint = function (x, y) {
            if (!this._capInsets) {
                for (var i = 0; i < this._imgs.length; i++) {
                    this._imgs[i].setAnchorPoint(x, y);
                }
            }
            _super.prototype.setAnchorPoint.call(this,x,y);
        }

        p.setOptions = function (options, myUrl) {
            _super.prototype.setOptions.call(this,options, myUrl);
            flower.CCSHelp.imageLoadTextures(this, options.fileNameData, myUrl);
        }

        p.loadScale9 = function () {
            while (this._imgs.length) {
                this._imgs.pop().dispose();
            }
            if (this._capInsets) {
                if (!this._textureUrl || this._textureUrl == "") return;
                var sx = this._capInsets.x;
                var sy = this._capInsets.y;
                var w = this._capInsets.width;
                var h = this._capInsets.height;
                var tw;
                var th;
                if (this._textureType == 0) {
                    TextureManager.getInstance().loadTexture(this._textureUrl);
                    tw = TextureManager.getInstance().getTextureInfo(this._textureUrl).width;
                    th = TextureManager.getInstance().getTextureInfo(this._textureUrl).height;
                }
                else if (this._textureType == 1) {
                    tw = PlistManager.getInstance().getPlistFrame(this._textureUrl).width;
                    th = PlistManager.getInstance().getPlistFrame(this._textureUrl).height;
                }
                var leftTop;
                var centerTop;
                var rightTop;
                var leftCenter;
                var center;
                var rightCenter;
                var leftDown;
                var centerDown;
                var rightDown;
                if (this._textureType == 0) {
                    leftTop = flower.Bitmap.createSubBitmap(this._textureUrl, cc.rect(0, 0, sx, sy));
                    centerTop = flower.Bitmap.createSubBitmap(this._textureUrl, cc.rect(sx, 0, w, sy));
                    rightTop = flower.Bitmap.createSubBitmap(this._textureUrl, cc.rect(sx + w, 0, tw - sx - w, sy));
                    leftCenter = flower.Bitmap.createSubBitmap(this._textureUrl, cc.rect(0, sy, sx, h));
                    center = flower.Bitmap.createSubBitmap(this._textureUrl, cc.rect(sx, sy, w, h));
                    rightCenter = flower.Bitmap.createSubBitmap(this._textureUrl, cc.rect(sx + w, sy, tw - sx - w, h));
                    leftDown = flower.Bitmap.createSubBitmap(this._textureUrl, cc.rect(0, sy + h, sx, th - sy - h));
                    centerDown = flower.Bitmap.createSubBitmap(this._textureUrl, cc.rect(sx, sy + h, w, th - sy - h));
                    rightDown = flower.Bitmap.createSubBitmap(this._textureUrl, cc.rect(sx + w, sy + h, tw - sx - w, th - sy - h));
                }
                else if (this._textureType == 1) {
                    leftTop = flower.Bitmap.createSubBitmapFromPlist(this._textureUrl, cc.rect(0, 0, sx, sy));
                    centerTop = flower.Bitmap.createSubBitmapFromPlist(this._textureUrl, cc.rect(sx, 0, w, sy));
                    rightTop = flower.Bitmap.createSubBitmapFromPlist(this._textureUrl, cc.rect(sx + w, 0, tw - sx - w, sy));
                    leftCenter = flower.Bitmap.createSubBitmapFromPlist(this._textureUrl, cc.rect(0, sy, sx, h));
                    center = flower.Bitmap.createSubBitmapFromPlist(this._textureUrl, cc.rect(sx, sy, w, h));
                    rightCenter = flower.Bitmap.createSubBitmapFromPlist(this._textureUrl, cc.rect(sx + w, sy, tw - sx - w, h));
                    leftDown = flower.Bitmap.createSubBitmapFromPlist(this._textureUrl, cc.rect(0, sy + h, sx, th - sy - h));
                    centerDown = flower.Bitmap.createSubBitmapFromPlist(this._textureUrl, cc.rect(sx, sy + h, w, th - sy - h));
                    rightDown = flower.Bitmap.createSubBitmapFromPlist(this._textureUrl, cc.rect(sx + w, sy + h, tw - sx - w, th - sy - h));
                }
                this._imgs.push(leftTop);
                this._imgs.push(centerTop);
                this._imgs.push(rightTop);
                this._imgs.push(leftCenter);
                this._imgs.push(center);
                this._imgs.push(rightCenter);
                this._imgs.push(leftDown);
                this._imgs.push(centerDown);
                this._imgs.push(rightDown);
                for (var i = 0; i < this._imgs.length; i++) {
                    this._imgs[i].setAnchorPoint(0, 0);
                    this.addChild(this._imgs[i]);
                }
                leftTop.setPosition2(0, this._height - sy);
                centerTop.setPosition2(sx, this._height - sy);
                centerTop.setScaleX((this._width - tw + w) / w);
                rightTop.setPosition2(this._width - tw + sx + w, this._height - sy);
                leftCenter.setPosition2(0, -sy + th - h);
                leftCenter.setScaleY((this._height - th + h) / h);
                center.setPosition2(sx, -sy + th - h);
                center.setScaleX((this._width - tw + w) / w);
                center.setScaleY((this._height - th + h) / h);
                rightCenter.setPosition2(this._width - tw + sx + w, -sy + th - h);
                rightCenter.setScaleY((this._height - th + h) / h);
                leftDown.setPosition2(0, 0);
                centerDown.setPosition2(sx, 0);
                centerDown.setScaleX((this._width - tw + w) / w);
                rightDown.setPosition2(this._width - tw + sx + w, 0);
            }
        }

        p.dispose = function () {
            _super.prototype.dispose.call(this);
            if (this.className == flower.ClassName.CCSImageView) {
                flower.BufferPool.cycle(flower.ClassName.CCSImageView, this, flower.BufferPool.CCSImageView);
            }
        }

        CCSImageView.create = function () {
            flower.ClassLock.CCSImageView = false;
            var img = flower.BufferPool.create(flower.ClassName.CCSImageView, CCSImageView);
            flower.ClassLock.CCSImageView = true;
            return img;
        }

        return CCSImageView;
    })(flower.CCSBase);
    flower.CCSImageView = CCSImageView;
    egret.registerClass(CCSImageView, "flower.CCSImageView");
})(flower || (flower = {}));
