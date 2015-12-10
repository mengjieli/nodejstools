var flower;
(function (flower) {
    var MouseEvent = (function (_super) {
        __extends(MouseEvent, _super);

        function MouseEvent(type) {
            _super.call(this, type);
        }

        p.getLocation = function () {
            return {
                x: this.mouseX,
                y: this.mouseY
            };
        }

        var d = __define, c = MouseEvent;
        p = c.prototype;

        MouseEvent.MOUSE_DOWN = "mouse_down";
        MouseEvent.MOUSE_MOVE = "mouse_move";
        MouseEvent.MOUSE_OVER = "mouse_over";
        MouseEvent.MOUSE_OUT = "mouse_out";
        MouseEvent.CLICK = "click";

        return MouseEvent;
    })(flower.Event);

    flower.MouseEvent = MouseEvent;
})(flower || (flower = {}));
