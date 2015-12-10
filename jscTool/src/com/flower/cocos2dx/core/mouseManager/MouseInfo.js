var flower;
(function (flower) {
    var MouseInfo = (function () {
        function MouseInfo() {
            this.moveX = -100000;
            this.moveY = -100000;
        }

        var d = __define, c = MouseInfo;
        p = c.prototype;

        p.initBuffer = function () {
            this.moveX = -100000;
            this.moveY = -100000;
        }

        return MouseInfo;
    })();
    flower.MouseInfo = MouseInfo;
})(flower || (flower = {}));
