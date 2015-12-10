var flower;
(function (flower) {
    var BasicPlugin = (function () {
        function BasicPlugin() {
        }
        /**
         * @inheritDoc
         * @version Lark 1.0
         * @platform Web,Native
         */
        BasicPlugin.prototype.init = function (tween, propertiesTo, propertiesFrom) {
            this.tween = tween;
            this._attributes = propertiesTo;
            this.keys = Object.keys(propertiesTo);
            var target = tween.target;
            var startAttributes = {};
            var keys = this.keys;
            var length = keys.length;
            for (var i = 0; i < length; i++) {
                var key = keys[i];
                if (propertiesFrom && key in propertiesFrom) {
                    startAttributes[key] = propertiesFrom[key];
                }
                else {
                    startAttributes[key] = target[key];
                }
            }
            this.startAttributes = startAttributes;
            return null;
        };
        /**
         * @inheritDoc
         * @version Lark 1.0
         * @platform Web,Native
         */
        BasicPlugin.prototype.update = function (value) {
            var target = this.tween.target;
            var keys = this.keys;
            var length = keys.length;
            var startAttributes = this.startAttributes;
            for (var i = 0; i < length; i++) {
                var key = keys[i];
                target[key] = (this._attributes[key] - startAttributes[key]) * value + startAttributes[key];
            }
        };
        return BasicPlugin;
    })();
    flower.BasicPlugin = BasicPlugin;
})(flower || (flower = {}));
//# sourceMappingURL=BasicPlugin.js.map