/**
 * 事件监听器
 * @constructor
 */
function ListenerBase() {

}

ListenerBase.registerClass = function (cls) {
    var p = cls.prototype;
    p.$listeners = null;
    /**
     * 监听事件
     * @param type
     * @param back
     * @param thisObj
     */
    p.addListener = function (type, back, thisObj) {
        if (!this.$listeners) {
            this.$listeners = [];
        }
        if (!this.$listeners[type]) {
            this.$listeners[type] = [];
        }
        var list = this.$listeners[type];
        for (var i = 0; i < list.length; i++) {
            if (list[i].back == back && list[i].thisObj == thisObj) {
                return;
            }
        }
        list.push({
            back: back,
            thisObj: thisObj
        });
    };
    p.removeListener = function (type, back, thisObj) {
        if (!this.$listeners) {
            this.$listeners = [];
        }
        if (!this.$listeners[type]) {
            return;
        }
        var list = this.$listeners[type];
        for (var i = 0; i < list.length; i++) {
            if (list[i].back == back && list[i].thisObj == thisObj) {
                list.splice(i, 1);
                break;
            }
        }
    };
    /**
     * 调用事件
     * @param type
     */
    p.call = function (type) {
        if (!this.$listeners || !this.$listeners[type]) {
            return;
        }
        var args = [];
        for (var i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        var list = this.$listeners[type];
        if (list) {
            list = list.concat();
            for (i = 0; i < list.length; i++) {
                var item = list[i];
                item.back.apply(item.thisObj, args);
            }
        }
    }
}