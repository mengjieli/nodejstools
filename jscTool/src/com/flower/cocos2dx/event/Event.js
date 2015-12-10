var flower;
(function (flower) {
    var Event = (function () {
        function Event(type) {
            this.type = type;
        }

        var d = __define, c = Event;
        p = c.prototype;
        
        Event.CHANGE = "change";
        Event.INIT_COMPLETE = "init_complete";
        Event.ADD = "add";
        Event.REMOVE = "remove";
        Event.ADD_TO_STAGE = "add_to_stage";
        Event.REMOVE_FROM_STAGE = "remove_from_stage";
        Event.DISPOSE = "dispose";
        Event.COMPLETE = "complete";
        Event.extend = extendClass;

        return Event;
    })();
    flower.Event = Event;
})(flower || (flower = {}));