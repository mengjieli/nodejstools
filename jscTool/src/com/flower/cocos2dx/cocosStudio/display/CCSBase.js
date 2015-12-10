var flower;
(function (flower) {
    var CCSBase = (function (_super) {
        __extends(CCSBase, _super);
        //_name: null,
        //_bright: null,
        function CCSBase(subClass, init) {
            subClass = subClass == null ? false : subClass;
            init = init == null ? true : init;
            _super.call(this, true, init);
            this.className = flower.ClassName.CCSBase;
            if (subClass == false && flower.ClassLock.CCSBase == true) {
                flower.DebugInfo.debug("|创建CCSWidget| 不能new，请使用子类CCSPanel", flower.DebugInfo.ERROR);
                return;
            }
        }

        var d = __define, c = CCSBase;
        p = c.prototype;

        p.initBuffer = function () {
            _super.prototype.initBuffer.call(this);
            this._bright = true;
        }

        p.getName = function () {
            return this._name;
        }

        p.setName = function (val) {
            this._name = val;
        }

        p.getChildByName = function (name) {
            for (var i = 0; i < this._childs.length; i++) {
                if (((IDE.TYPE == 1 && this._childs[i].hasOwnProperty("getName")) ||
                    (IDE.TYPE == 2 && this._childs[i]["getName"]))
                    && (this._childs[i]).getName() == name) {
                    return this._childs[i];
                }
            }
            return null;
        }

        p.setBright = function (val) {
            this._bright = val;
        }

        p.setSize = function (val) {
            this._width = val.width;
            this._height = val.height;
        }

        p.getContentSize = function () {
            return cc.size(this._width, this._height);
        }

        p.getSize = function () {
            return cc.size(this._width, this._height);
        }

        p.setOptions = function (options, myUrl) {
            this.setName(options.name);
            this.setSize(cc.size(options.width, options.height));
            this.setAnchorPoint(options.anchorPointX, options.anchorPointY);
            this.setRotation(options.rotation);
            this.setScaleX(options.scaleX * (options.flipX ? -1 : 1));
            this.setScaleY(options.scaleY * (options.flipY ? -1 : 1));
            this.setVisible(options.visible);
            this.setX(options.x);
            this.setY(options.y);
            this.setPosition2(options.x, options.y);
        }

        p.getWidth = function () {
            return this._width;
        }

        __define(p, "width",
            function () {
                return this._width;
            },
            function (val) {

            }
        )

        p.getHeight = function () {
            return this._height;
        }

        __define(p, "height",
            function () {
                return this._height;
            },
            function (val) {

            }
        )

        return CCSBase;
    })(flower.DisplayObjectContainer);
    flower.CCSBase = CCSBase;
})(flower || (flower = {}));

