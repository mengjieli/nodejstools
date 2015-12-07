var flower;
(function (flower) {
    var TweenPhysicMove = (function () {
        function TweenPhysicMove() {
        }
        /**
         * @inheritDoc
         * @version Lark 1.0
         * @platform Web,Native
         */
        TweenPhysicMove.prototype.init = function (tween, propertiesTo, propertiesFrom) {
            this.tween = tween;
            var useAttributes = ["physicMove"];
            var target = tween.target;
            var startX = target.x;
            var startY = target.y;
            if (propertiesFrom) {
                if ("x" in propertiesFrom) {
                    startX = +propertiesFrom["x"];
                }
                if ("y" in propertiesFrom) {
                    startY = +propertiesFrom["y"];
                }
            }
            this.startX = startX;
            this.startY = startY;
            var endX = startX;
            var endY = startY;
            if ("x" in propertiesTo) {
                endX = +propertiesTo["x"];
                useAttributes.push("x");
            }
            if ("y" in propertiesTo) {
                endY = +propertiesTo["y"];
                useAttributes.push("y");
            }
            var vx = 0;
            var vy = 0;
            var t = tween.time;
            if ("vx" in propertiesTo) {
                vx = +propertiesTo["vx"];
                useAttributes.push("vx");
                if (!("x" in propertiesTo)) {
                    endX = startX + t * vx;
                }
            }
            if ("vy" in propertiesTo) {
                vy = +propertiesTo["vy"];
                useAttributes.push("vy");
                if (!("y" in propertiesTo)) {
                    endY = startY + t * vy;
                }
            }
            this.vx = vx;
            this.vy = vy;
            this.ax = (endX - startX - vx * t) * 2 / (t * t);
            this.ay = (endY - startY - vy * t) * 2 / (t * t);
            this.time = t;
            return useAttributes;
        };
        /**
         * @inheritDoc
         * @version Lark 1.0
         * @platform Web,Native
         */
        TweenPhysicMove.prototype.update = function (value) {
            var target = this.tween.target;
            var t = this.time * value;
            target.x = this.startX + this.vx * t + .5 * this.ax * t * t + this.startX;
            target.y = this.startY + this.vy * t + .5 * this.ay * t * t + this.startY;
        };
        TweenPhysicMove.freeFallTo = function (target, time, groundY) {
            return Tween.to(target, time, { "y": groundY, "physicMove": true });
        };
        TweenPhysicMove.freeFallToWithG = function (target, g, groundY) {
            return Tween.to(target, Math.sqrt(2 * (groundY - target.y) / g), { "y": groundY, "physicMove": true });
        };
        TweenPhysicMove.fallTo = function (target, time, groundY, vX, vY) {
            return Tween.to(target, time, { "y": groundY, "physicMove": true, "vx": vX, "vy": vY });
        };
        TweenPhysicMove.fallToWithG = function (target, g, groundY, vX, vY) {
            vX = +vX;
            vY = +vY;
            return Tween.to(target, Math.sqrt(2 * (groundY - target.y) / g + (vY * vY / (g * g))) - vY / g, {
                "y": groundY,
                "physicMove": true,
                "vx": vX,
                "vy": vY
            });
        };
        TweenPhysicMove.to = function (target, time, xTo, yTo, vX, vY) {
            if (vX === void 0) { vX = 0; }
            if (vY === void 0) { vY = 0; }
            return Tween.to(target, time, { "x": xTo, "y": yTo, "vx": vX, "vy": vY, "physicMove": true });
        };
        return TweenPhysicMove;
    })();
    flower.TweenPhysicMove = TweenPhysicMove;
    Tween.registerPlugin("physicMove", flower.TweenPhysicMove);
})(flower || (flower = {}));
//# sourceMappingURL=TweenPhysicMove.js.map