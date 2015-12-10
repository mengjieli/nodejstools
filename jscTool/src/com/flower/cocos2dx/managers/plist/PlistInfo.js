var flower;
(function (flower) {
    var PlistInfo = (function (_super) {
        __extends(PlistInfo, _super);
        function PlistInfo(url) {
            _super.call(this);
            this.url = url;
            this.loadConfigFlag = false;
            var urlloader = new flower.URLLoader();
            urlloader.addEventListener(flower.Event.COMPLETE, this.loadPlistComplete, this);
            urlloader.load(url);
            this.initBuffer();
        }

        var d = __define, c = PlistInfo;
        p = c.prototype;

        p.initBuffer = function () {
            this.count = 0;
            if (!this.frames) {
                this.frames = [];
            }
        }

        p.cycleBuffer = function () {
            while (this.frames.length) {
                this.frames.pop().cycle();
            }
            if (this.texture.getCount() == 0) {
                TextureManager.getInstance().delTexture(this.texture);
            }
            this.texture = null;
        }

        p.cycle = function () {
            BufferPool.cycle(ClassName.PlistInfo, this, PlistInfo.maxBuffer);
        }

        p.getFrame = function (name) {
            var len = this.frames.length;
            for (var i = 0; i < len; i++) {
                if (this.frames[i].name == name) return this.frames[i];
            }
            return null;
        }

        p.loadPlistComplete = function (event) {
            event.currentTarget.removeEventListener(flower.Event.COMPLETE, this.loadPlistComplete, this);
            this.loadConfigFlag = true;
            var content = event.currentTarget.data;
            var xml = new jc.XMLElement();
            xml.decode(content);
            xml = xml.list[0];
            var reslist;
            var attributes;
            for (var i = 0; i < xml.list.length; i++) {
                if (xml.list[i].name == "key") {
                    if (xml.list[i].value == "frames") {
                        reslist = xml.list[i + 1];
                    }
                    else if (xml.list[i].value == "metadata") {
                        attributes = xml.list[i + 1];
                    }
                    i++;
                }
            }
            var frame;
            for (i = 0; i < reslist.list.length; i++) {
                if (reslist.list[i].name == "key") {
                    frame = new flower.PlistFrameInfo();
                    frame.name = reslist.list[i].value;
                    frame.decode(reslist.list[i + 1]);
                    this.frames.push(frame);
                    i++;
                }
            }
            for (i = 0; i < attributes.list.length; i++) {
                if (attributes.list[i].name == "key") {
                    if (attributes.list[i].value == "realTextureFileName") {
                        var end = -1;
                        for (var c = 0; c < this.url.length; c++) {
                            if (this.url.charAt(c) == "/") {
                                end = c;
                            }
                        }
                        if (end == -1) this.textureUrl = attributes.list[i + 1].value;
                        else  this.textureUrl = this.url.slice(0, end + 1) + attributes.list[i + 1].value;
                    }
                    else if (attributes.list[i].value == "size") {
                        var size = attributes.list[i + 1].value;
                        size = size.slice(1, size.length - 1);
                        this.width = Math.floor(size.split(",")[0]);
                        this.height = Math.floor(size.split(",")[1]);
                    }
                    i++;
                }
            }
            var loader = new flower.URLLoader();
            loader.addEventListener(flower.Event.COMPLETE, this.loadTextureComplete, this);
            loader.load(this.textureUrl);
        }

        p.loadTextureComplete = function (event) {
            event.currentTarget.removeEventListener(flower.Event.COMPLETE, this.loadTextureComplete, this);
            this.texture = flower.TextureManager.getInstance().getNewTexture(this.textureUrl);
            for (var i = 0; i < this.frames.length; i++) {
                this.frames[i].texture = this.texture;
            }
            this.dispatchEvent(new flower.Event(flower.Event.COMPLETE));
        }

        p.isReady = function () {
            if (this.texture && flower.TextureManager.getInstance().hasTexture(this.textureUrl)) {
                return true;
            }
            return false;
        }

        p.loadTexture = function () {
            if (!this.loadConfigFlag) {
                return;
            }
            if (this.texture && flower.TextureManager.getInstance().hasTexture(this.textureUrl)) {
                return;
            }
            flower.TextureManager.getInstance().loadTexture(this.textureUrl, this.loadTextureComplete, this);
        }

        PlistInfo.maxBuffer = 100;
        PlistInfo.extend = extendClass;

        return PlistInfo;
    })(flower.EventDispatcher);
    flower.PlistInfo = PlistInfo;
})(flower || (flower = {}));