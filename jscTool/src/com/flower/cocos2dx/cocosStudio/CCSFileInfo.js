var flower;
(function (flower) {
    var CCSFileInfo = (function (_super) {
        __extends(CCSFileInfo, _super);
        function CCSFileInfo() {
        }

        var d = __define, c = CCSFileInfo;
        p = c.prototype;

        __define(p, "content",
            function () {
                return this._content;
            },
            function (val) {

            }
        )

        p.load = function (url) {
            this.url = url;
            var loader = new flower.URLLoader();
            loader.load(url);
            loader.addEventListener(flower.Event.COMPLETE, this.loadComplete, this);
        }

        p.loadComplete = function (event) {
            event.currentTarget.removeEventListener(flower.Event.COMPLETE, this.loadComplete, this);
            this._content = event.currentTarget.data;
        }

        p.dispose = function () {
            this._content = null;
        }

        return CCSFileInfo;
    })(flower.EventDispatcher);
    flower.CCSFileInfo = CCSFileInfo;
})(flower || (flower = {}));