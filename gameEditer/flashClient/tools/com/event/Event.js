var Event = (function () {
    function Event(type) {
        this.type = type;
    }

    var d = __define, c = Event;
    p = c.prototype;

    Event.CONNECT = "connect";
    Event.CLOSE = "close";
    Event.UPDATE = "update";
    Event.DATA = "data";

    return Event;
})();

global.Event = Event;