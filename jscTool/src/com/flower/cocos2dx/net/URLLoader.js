var flower;
(function (flower) {
    var URLLoader = (function (_super) {
        __extends(URLLoader, _super);

        function URLLoader() {
            _super.call(this);

        }

        var d = __define, c = URLLoader;
        p = c.prototype;

        p.load = function (url, dataFormat) {
            this.url = url;
            if (dataFormat) {
                this._dataFormat = dataFormat;
            } else {
                this._dataFormat = "";
                if (url.split(".").length == 2) {
                    this._dataFormat = url.split(".")[1];
                    this._dataFormat = this._dataFormat.split("?")[0];
                }
                if (!this._dataFormat) {
                    this._dataFormat = "txt";
                }
            }
            var _this = this;
            if (this._dataFormat == "jpg" || this._dataFormat == "png") {
                if (flower.TextureManager.getInstance().hasTexture(this.url)) {
                    jc.CallLater.add(_this.loadComplete, _this, null);
                } else {
                    cc.TextureCache.getInstance().addImage(this.url);
                    var texture = cc.TextureCache.getInstance().getTextureForKey(this.url);
                    flower.TextureManager.getInstance().createTexture(this.url, texture);
                    jc.CallLater.add(_this.loadComplete, _this, null);
                }
            } else {
                cc.loader.loadTxt(url, function (error, data) {
                    if (error) {
                        DebugInfo.debug("加载资源失败:" + url, DebugInfo.ERROR);
                    } else {
                        jc.CallLater.add(_this.loadComplete, _this, data);
                    }
                });
            }
        }

        p.loadComplete = function (data) {
            if (this._dataFormat == "json") {
                this._data = new jc.JSONDecoder(data).getValue();
            } else {
                this._data = data;
            }
            this.dispatchEvent(new flower.Event(flower.Event.COMPLETE));
        }

        __define(p, "dataFormat",
            function () {
                return this._dataFormat;
            },
            function (val) {
            }
        )

        __define(p, "data",
            function () {
                if (this._dataFormat == "jpg" || this._dataFormat == "png") {
                    if (this._data == null) {
                        this._data = flower.TextureManager.getInstance().getNewTexture(this.url);
                    }
                    return this._data;
                }
            },
            function (val) {

            }
        )

        return URLLoader;
    })(flower.EventDispatcher);
    flower.URLLoader = URLLoader;
})(flower || (flower = {}));