var flower;
(function (flower) {
    var TimeLine = (function () {
        function TimeLine() {
            this.lastTime = -1;
            this._currentTime = 0;
            this._totalTime = 0;
            this.invalidTotalTime = true;
            this._loop = false;
            this._isPlaying = false;
            this.tweens = [];
            this.calls = [];
        }
        Object.defineProperty(TimeLine.prototype, "totalTime", {
            //获取总时间。
            get: function () {
                return this.getTotalTime();
            },
            enumerable: true,
            configurable: true
        });
        TimeLine.prototype.getTotalTime = function () {
            if (this.invalidTotalTime == true) {
                return this._totalTime;
            }
            this.invalidTotalTime = true;
            var tweens = this.tweens;
            var endTime = 0;
            var time;
            for (var i = 0, len = tweens.length; i < len; i++) {
                time = tweens[i].startTime + tweens[i].time;
                if (time > endTime) {
                    endTime = time;
                }
            }
            this._totalTime = endTime * 1000;
            return endTime;
        };
        TimeLine.prototype.$invalidateTotalTime = function () {
            if (this.invalidTotalTime == false) {
                return;
            }
            this.invalidTotalTime = false;
        };
        Object.defineProperty(TimeLine.prototype, "loop", {
            //是否循环播放
            get: function () {
                return this._loop;
            },
            set: function (value) {
                this._loop = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimeLine.prototype, "isPlaying", {
            get: function () {
                return this._isPlaying;
            },
            enumerable: true,
            configurable: true
        });
        TimeLine.prototype.update = function (timeStamp) {
            var totalTime = this.getTotalTime();
            var lastTime = this._currentTime;
            this._currentTime += timeStamp - this.lastTime;
            var currentTime = -1;
            var loopTime = 0;
            if (this._currentTime >= totalTime) {
                currentTime = this._currentTime % totalTime;
                loopTime = Math.floor(this._currentTime / totalTime);
                if (!this._loop) {
                    this.$setPlaying(false);
                }
            }
            while (loopTime > -1) {
                if (loopTime && currentTime != -1) {
                    this._currentTime = totalTime;
                }
                var calls = this.calls;
                var call;
                for (i = 0, len = calls.length; i < len; i++) {
                    call = calls[i];
                    if (call.time > lastTime && call.time <= this._currentTime || (call.time == 0 && lastTime == 0 && this._currentTime)) {
                        call.callBack.apply(call.thisObj, call.args);
                    }
                }
                var tweens = this.tweens;
                var tween;
                for (var i = 0, len = tweens.length; i < len; i++) {
                    tween = tweens[i];
                    if (tween.$startTime + tween.$time > lastTime && tween.$startTime <= this._currentTime || (tween.$startTime == 0 && lastTime == 0 && this._currentTime)) {
                        tween.$update(this._currentTime);
                    }
                }
                loopTime--;
                if (loopTime == 0) {
                    if (currentTime != -1) {
                        lastTime = 0;
                        this._currentTime = currentTime;
                    }
                }
                else {
                    if (loopTime) {
                        lastTime = 0;
                    }
                }
                if (this._loop == false) {
                    break;
                }
            }
            this.lastTime = timeStamp;
            return true;
        };
        //播放。时间轴默认是停止的。调用此方法可以开始播放，也可以在停止后调用此方法继续播放。
        TimeLine.prototype.play = function () {
            var now = jc.EnterFrame.curTime;
            this.$setPlaying(true, now);
        };
        //暂停播放。
        TimeLine.prototype.stop = function () {
            this.$setPlaying(false);
        };
        TimeLine.prototype.$setPlaying = function (value, time) {
            if (value) {
                this.lastTime = time;
            }
            if (this._isPlaying == value) {
                return;
            }
            this._isPlaying = value;
            if (value) {
                jc.EnterFrame.add(this.update, this);
            }
            else {
                jc.EnterFrame.del(this.update, this);
            }
        };
        //跳到指定的帧并播放。
        TimeLine.prototype.gotoAndPlay = function (time) {
            if (!this.tweens.length) {
                return;
            }
            time = +time | 0;
            time = time < 0 ? 0 : time;
            if (time > this.totalTime) {
                time = this.totalTime;
            }
            this._currentTime = time;
            var now = jc.EnterFrame.curTime;
            this.$setPlaying(true, now);
        };
        //跳到指定的帧并停止。
        TimeLine.prototype.gotoAndStop = function (time) {
            if (!this.tweens.length) {
                return;
            }
            time = +time | 0;
            time = time < 0 ? 0 : time;
            if (time > this.totalTime) {
                time = this.totalTime;
            }
            this._currentTime = time;
            var now = jc.EnterFrame.curTime;
            this.$setPlaying(false);
        };
        //添加Tween。
        TimeLine.prototype.addTween = function (tween) {
            this.tweens.push(tween);
            tween.$setTimeLine(this);
            this.$invalidateTotalTime();
            return tween;
        };
        //移除Tween。
        TimeLine.prototype.removeTween = function (tween) {
            var tweens = this.tweens;
            for (var i = 0, len = tweens.length; i < len; i++) {
                if (tweens[i] == tween) {
                    tweens.splice(i, 1)[0].$setTimeLine(null);
                    this.$invalidateTotalTime();
                    break;
                }
            }
            if (tweens.length == 0) {
                this.$setPlaying(false);
            }
        };
        //添加回调函数。
        TimeLine.prototype.call = function (time, callBack, thisObj) {
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
            this.calls.push({ "time": time, "callBack": callBack, "thisObj": thisObj, "args": args });
        };
        return TimeLine;
    })();
    flower.TimeLine = TimeLine;
})(flower || (flower = {}));
//# sourceMappingURL=TimeLine.js.map