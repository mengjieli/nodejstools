var flower;
(function (flower) {
    var Bitmap = (function (_super) {
        __extends(Bitmap, _super);

        function Bitmap() {
            _super.call(this, true);
            this.className = flower.ClassName.Bitmap;
            if (flower.ClassLock.Bitmap == true) {
                flower.DebugInfo.debug("|创建Bitmap| 创建失败，请访问Bitmap.create()方法创建", DebugInfo.ERROR);
                return;
            }
        }

        var d = __define, c = Bitmap;
        p = c.prototype;

        p.initBuffer = function () {
            _super.prototype.initBuffer.call(this);
            this._show = new cc.Sprite();
            //this._show = flower.BufferPool.createCCNode(ClassName.CCSprite);
        }

        p.cycleBuffer = function () {
            flower.TextureManager.getInstance().disposeTexure(this._texture);
            this._texture = null;
            //flower.BufferPool.cycyleCCNode(this._show, flower.ClassName.CCSprite);
            this._show = null;
            this._url = null;
            _super.prototype.cycleBuffer.call(this);
        }

        p.initWidthTexture = function (txt) {
            if (this._texture != null) {
                flower.DebugInfo.debug("如果图片要换内容请用CCSImageView", DebugInfo.ERROR);
                return;
            }
            this._texture = txt;
            (this._show).initWithTexture(this._texture.getTexture());
        }

        p.initTextureFrame = function (txt, rect, rot, moveX, moveY) {
            if (this._texture != null) {
                DebugInfo.debug("如果图片要换内容请用CCSImageView", DebugInfo.ERROR);
                return;
            }
            this._texture = txt;
            var size = {};
            size.width = moveX * 2 + rect.width;
            size.height = moveY * 2 + rect.height;
            this._moveX = moveX;
            this._moveY = moveY;
            trace(rect.x, rect.y, rect.width, rect.height);
            trace(rot);
            trace(moveX, moveY);
            (this._show).setTexture(this._texture.getTexture());
            (this._show).setTextureRect(rect, rot, size);
            this.initSize(rect.width, rect.height);
        }

        p.initSize = function (w, h) {
            this._width = w;
            this._height = h;
            this._show.setAnchorPoint(this._anchorX, this._anchorY);
        }

        p.setOff = function (offx, offy, sx, sy) {
            return;
            (this._show).setTextureOffset(cc.p(offx, offy));
            this._moveX = sx;
            this._moveY = sy;
        }

        p.setParentAlpha = function (val) {
            this._parentAlpha = val;
            (this._show).setOpacity(this._alpha * this._parentAlpha * 255);
        }

        p.setAlpha = function (val) {
            this._alpha = val;
            (this._show).setOpacity(this._alpha * this._parentAlpha * 255);
        }

        p.setBlendMode = function (val) {
            if (val == Blend.NORMAL) {
                (this._show).setBlendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            }
            else if (val == Blend.ADD) {
                (this._show).setBlendFunc(gl.ONE, gl.ONE);
            }
        }

        p.getSourceWidth = function () {
            return this._texture.width;
        }

        p.getSourceHeight = function () {
            return this._texture.height;
        }

        p.loadSourceWithPlistAndSize = function (name, plist, rect, rot, moveX, moveY) {
            this.loadSourceWithPlist(name, plist);
            this._loaderInfo = {
                rect: rect,
                moveX: moveX,
                moveY: moveY,
                rot: rot
            }
        }

        /**
         *
         * @param name
         * @param plist PlistInfo
         */
        p.loadSourceWithPlist = function (name, plist) {
            if (plist) {
                if (plist.isReady() == false) {
                    this.plistFrameName = name;
                    plist.loadTexture();
                    plist.addEventListener(flower.Event.COMPLETE, this.loadPlistComplete, this);
                } else {
                    this.loadFromPlist(plist.getFrame(name));
                }
            } else {
                this.loadFromPlist(flower.PlistManager.getInstance().getPlistFrame(name));
            }
        }

        p.loadPlistComplete = function (event) {
            event.currentTarget.removeEventListener(flower.Event.COMPLETE, this.loadPlistComplete, this);
            this.loadFromPlist(event.currentTarget.getFrame(this.plistFrameName));
        }

        p.loadFromPlist = function (frame) {
            if (this._loaderInfo) {
                this.initTextureFrame(frame.texture, cc.rect(frame.x + this._loaderInfo.rect.x, frame.y + this._loaderInfo.rect.y
                    , this._loaderInfo.rect.width, this._loaderInfo.rect.height), frame.rot, this._loaderInfo.moveX, this._loaderInfo.moveY);
            } else {
                this.initTextureFrame(frame.texture, cc.rect(frame.x, frame.y, frame.width, frame.height), frame.rot, frame.moveX, frame.moveY);
            }
        }

        p.loadSourceWithSize = function (url, rect, rot, moveX, moveY) {
            this.source = url;
            this._loaderInfo = {
                rect: rect,
                moveX: moveX,
                moveY: moveY,
                rot: rot
            }
        }

        __define(p, "source",
            function () {
                return this._url;
            },
            function (val) {
                if (this._url == val) {
                    return;
                }
                this._url = val;
                if (this._loader) {
                    this._loader.removeEventListener(flower.Event.COMPLETE, this.loadSourceBack, this);
                    this._loader = null;
                }
                if (!this._url || this._url == "") {
                    this._texture = null;
                    this._width = 0;
                    this._height = 0;
                    this._show.setVisible(false);
                    return;
                }
                this._loaderInfo = null;
                this._show.setVisible(true);
                this._loader = new flower.URLLoader();
                this._loader.load(this._url);
                this._loader.addEventListener(flower.Event.COMPLETE, this.loadSourceBack, this);
            }
        )

        p.loadSourceBack = function (event) {
            this._loader.removeEventListener(flower.Event.COMPLETE, this.loadSourceBack, this);
            this._loader = null;
            if (this._loaderInfo) {
                this.initTextureFrame(flower.TextureManager.getInstance().getNewTexture(this._url),
                    this._loaderInfo.rect, this._loaderInfo.rot, this._loaderInfo.moveX, this._loaderInfo.moveY);
                this._loaderInfo = null;
            } else {
                this.initWidthTexture(flower.TextureManager.getInstance().getNewTexture(this._url));
                this.initSize(this._texture.width, this._texture.height);
            }
            if (this.hasEventListener(flower.Event.COMPLETE)) {
                this.dispatchEvent(new flower.Event.COMPLETE);
            }
        }

        p.dispose = function () {
            if (this.incycle) {
                return;
            }
            if (this._loader) {
                this._loader.removeEventListener(flower.Event.COMPLETE, this.loadSourceBack, this);
                this._loader = null;
            }
            this._loaderInfo = null;
            _super.prototype.dispose.call(this);
            if (this.className == flower.ClassName.Bitmap) {
                flower.BufferPool.cycle(flower.ClassName.Bitmap, this, flower.BufferPool.BitmapMax);
            }
        }

        Bitmap.create = function (url) {
            url = url || "";
            flower.ClassLock.Bitmap = false;
            var bm = flower.BufferPool.create(flower.ClassName.Bitmap, Bitmap);
            flower.ClassLock.Bitmap = true;
            bm.source = url;
            return bm;
        }

        Bitmap.createPlistFrame = function (name, plistURL) {
            plistURL = plistURL || "";
            flower.ClassLock.Bitmap = false;
            var bm = flower.BufferPool.create(flower.ClassName.Bitmap, Bitmap);
            flower.ClassLock.Bitmap = true;
            var plist;
            if (plistURL != "") {
                plist = flower.PlistManager.getInstance().addPlist(plistURL);
            }
            bm.loadSourceWithPlist(name, plist);
            return bm;
        }

        Bitmap.createSubBitmap = function (url, rect, offX, offY) {
            url = url || "";
            var rot = false;
            offX = +offX || 0;
            offY = +offY || 0;
            flower.ClassLock.Bitmap = false;
            var bm = flower.BufferPool.create(flower.ClassName.Bitmap, Bitmap);
            flower.ClassLock.Bitmap = true;
            bm.loadSourceWithSize(url, rect, rot, offX, offY);
            return bm;
        }

        Bitmap.createSubBitmapFromPlist = function (name, plistURL, rect, offX, offY) {
            var rot = false;
            offX = +offX || 0;
            offY = +offY || 0;
            plistURL = plistURL || "";
            flower.ClassLock.Bitmap = false;
            var bm = flower.BufferPool.create(flower.ClassName.Bitmap, Bitmap);
            flower.ClassLock.Bitmap = true;
            var plist;
            if (plistURL != "") {
                plist = flower.PlistManager.getInstance().addPlist(plistURL);
            }
            bm.loadSourceWithPlistAndSize(name, plist, rect, rot, offX, offY);
            return bm;
        }

        return Bitmap;
    })(flower.DisplayObject)
    flower.Bitmap = Bitmap;
})(flower || (flower = {}));