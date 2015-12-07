var flower;
(function (flower) {
    /**
     * @private
     */
    var easeCache = {};
    /**
     * @language en_US
     * The tween.
     * @version Lark 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 缓动类。
     * @version Lark 1.0
     * @platform Web,Native
     */
    var Tween = (function () {
        /**
         * @language en_US
         * Constructor.
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 构造函数。
         * @param target 要变换的属性
         * @version Lark 1.0
         * @platform Web,Native
         */
        function Tween(target, time, propertiesTo, ease, propertiesFrom) {
            this.invalidProperty = false;
            /**
             * @private
             */
            this.$startTime = 0;
            /**
             * @private
             */
            this._currentTime = 0;
            this._startEvent = "";
            /**
             * @private
             */
            this.pugins = [];
            //super();
            time = +time;
            if (time < 0) {
                time = 0;
            }
            this.$time = time * 1000;
            this._target = target;
            this._propertiesTo = propertiesTo;
            this._propertiesFrom = propertiesFrom;
            this.ease = ease;
            if (!this._ease) {
                this.ease = Ease.NONE;
            }
            var timeLine = new flower.TimeLine();
            timeLine.addTween(this);
        }
        Object.defineProperty(Tween.prototype, "propertiesTo", {
            set: function (value) {
                if (value == this._propertiesTo) {
                    return;
                }
                this._propertiesTo = value;
                this.invalidProperty = false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tween.prototype, "propertiesFrom", {
            set: function (value) {
                if (value == this._propertiesFrom) {
                    return;
                }
                this._propertiesFrom = value;
                this.invalidProperty = false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tween.prototype, "time", {
            /**
             * @language en_US
             * The total transformation time.
             * @see lark.Tween
             * @version Lark 1.0
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 总的变换时间。
             * @see lark.Tween
             * @version Lark 1.0
             * @platform Web,Native
             */
            get: function () {
                return this.$time / 1000;
            },
            set: function (value) {
                value = +value | 0;
                this.$time = (+value) * 1000;
                if (this._timeLine) {
                    this._timeLine.$invalidateTotalTime();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tween.prototype, "startTime", {
            get: function () {
                return this.$startTime / 1000;
            },
            set: function (value) {
                value = +value | 0;
                if (value < 0) {
                    value = 0;
                }
                if (value == this.$startTime) {
                    return;
                }
                this.$startTime = value * 1000;
                if (this._timeLine) {
                    this._timeLine.$invalidateTotalTime();
                }
                this.invalidProperty = false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tween.prototype, "target", {
            /**
             * @language en_US
             * The object to transform.
             * @version Lark 1.0
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 要变换的对象。
             * @version Lark 1.0
             * @platform Web,Native
             */
            get: function () {
                return this._target;
            },
            set: function (value) {
                if (value == this.target) {
                    return;
                }
                this.removeTargetEvent();
                this._target = value;
                this.invalidProperty = false;
                this.addTargetEvent();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tween.prototype, "ease", {
            /**
             * @language en_US
             * The type of ease.
             * @see lark.Ease
             * @version Lark 1.0
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 缓动类型。
             * @see lark.Ease
             * @version Lark 1.0
             * @platform Web,Native
             */
            get: function () {
                return this._ease;
            },
            set: function (val) {
                if (!easeCache[val]) {
                    var func = EaseFunction[val];
                    if (func == null) {
                        /**
                         * to do
                         * warn can't find the ease function
                         */
                        return;
                    }
                    var cache = [];
                    for (var i = 0; i <= 2000; i++) {
                        cache[i] = func(i / 2000);
                    }
                    easeCache[val] = cache;
                }
                this._ease = val;
                this._easeData = easeCache[val];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tween.prototype, "startEvent", {
            get: function () {
                return this._startEvent;
            },
            set: function (type) {
                this.removeTargetEvent();
                this._startEvent = type;
                this.addTargetEvent();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tween.prototype, "startTarget", {
            get: function () {
                return this._startTarget;
            },
            set: function (value) {
                this.removeTargetEvent();
                this._startTarget = value;
                this.addTargetEvent();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         */
        Tween.prototype.removeTargetEvent = function () {
            var target;
            if (this._startTarget) {
                target = this._startTarget;
            }
            else {
                target = this._target;
            }
            if (target && this._startEvent && this._startEvent != "") {
                target.removeListener(this._startEvent, this.startByEvent, this);
            }
        };
        /**
         * @private
         */
        Tween.prototype.addTargetEvent = function () {
            var target;
            if (this._startTarget) {
                target = this._startTarget;
            }
            else {
                target = this._target;
            }
            if (target && this._startEvent && this._startEvent != "") {
                target.on(this._startEvent, this.startByEvent, this);
            }
        };
        /**
         * @private
         */
        Tween.prototype.startByEvent = function () {
            this._timeLine.gotoAndPlay(0);
        };
        Object.defineProperty(Tween.prototype, "timeLine", {
            get: function () {
                if (!this._timeLine) {
                    this._timeLine = new flower.TimeLine();
                    this._timeLine.addTween(this);
                }
                return this._timeLine;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         */
        Tween.prototype.$setTimeLine = function (value) {
            if (this._timeLine) {
                this._timeLine.removeTween(this);
            }
            this._timeLine = value;
        };
        /**
         * @private
         */
        Tween.prototype.initParmas = function () {
            var controller;
            var params = this._propertiesTo;
            var allPlugins = Tween.plugins;
            if (params) {
                var keys = Object.keys(allPlugins);
                var deletes = [];
                for (var i = 0, len = keys.length; i < len; i++) {
                    if (keys[i] in params) {
                        controller = new allPlugins[keys[i]];
                        deletes = deletes.concat(controller.init(this, params, this._propertiesFrom));
                        this.pugins.push(controller);
                    }
                }
                for (i = 0; i < deletes.length; i++) {
                    delete params[deletes[i]];
                }
                keys = Object.keys(params);
                for (i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    if (typeof (key) != "string") {
                        delete params[key];
                        keys.splice(i, 1);
                        i--;
                        continue;
                    }
                    var attribute = params[key];
                    if (typeof (attribute) != "number" || !(key in this._target)) {
                        delete params[key];
                        keys.splice(i, 1);
                        i--;
                        continue;
                    }
                }
                if (keys.length) {
                    controller = new BasicPlugin();
                    controller.init(this, params, this._propertiesFrom);
                    this.pugins.push(controller);
                }
            }
            this.invalidProperty = true;
        };
        Tween.prototype.invalidate = function () {
            this.invalidProperty = false;
        };
        /**
         * @language en_US
         * Tween end callback function.
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * Tween 结束回调函数。
         * @version Lark 1.0
         * @platform Web,Native
         */
        Tween.prototype.call = function (callBack, thisObj) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            this._complete = callBack;
            this._completeThis = thisObj;
            this._completeParams = args;
            return this;
        };
        Tween.prototype.update = function (callBack, thisObj) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            this._update = callBack;
            this._updateThis = thisObj;
            this._updateParams = args;
            return this;
        };
        /**
         * @private
         * @param time
         * @returns {boolean}
         */
        Tween.prototype.$update = function (time) {
            if (!this.invalidProperty) {
                this.initParmas();
            }
            this._currentTime = time - this.$startTime;
            if (this._currentTime > this.$time) {
                this._currentTime = this.$time;
            }
            var length = this.pugins.length;
            var s = this._easeData[2000 * (this._currentTime / this.$time) | 0];
            for (var i = 0; i < length; i++) {
                this.pugins[i].update(s);
            }
            if (this._update != null) {
                this._update.apply(this._updateThis, this._updateParams);
            }
            if (this._currentTime == this.$time) {
                if (this._complete != null) {
                    this._complete.apply(this._completeThis, this._completeParams);
                }
            }
            return true;
        };
        /**
         * @language en_US
         * Create a Tween object.
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 Tween 对象。
         * @version Lark 1.0
         * @platform Web,Native
         */
        Tween.to = function (target, time, propertiesTo, ease, propertiesFrom) {
            var tween = new Tween(target, time, propertiesTo, ease, propertiesFrom);
            tween.timeLine.play();
            return tween;
        };
        /**
         * @language en_US
         * Register a Tween plugin.
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 注册一个 Tween 插件。
         * @version Lark 1.0
         * @platform Web,Native
         */
        Tween.registerPlugin = function (paramName, plugin) {
            Tween.plugins[paramName] = plugin;
        };
        /**
         * @private
         */
        Tween.plugins = {};
        return Tween;
    })();
    flower.Tween = Tween;
})(flower || (flower = {}));
//# sourceMappingURL=Tween.js.map