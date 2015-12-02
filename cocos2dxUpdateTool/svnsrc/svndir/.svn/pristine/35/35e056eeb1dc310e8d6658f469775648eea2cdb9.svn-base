/**
 * 相隔多久回调一个函数
 * @param func
 * @param thisObj
 * @param time 单位秒
 * @constructor
 */
var IntervalCall = function (func, thisObj, time) {
    this.handler = setInterval(function () {
        func.apply(thisObj);
    }, time*1000);
}

/**
 * 清除回调
 */
IntervalCall.prototype.clear = function () {
    clearInterval(this.handler);
}