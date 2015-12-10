var flower;
(function (flower) {
    var MouseManager = (function () {
        function MouseManager() {
        }

        var d = __define, c = MouseManager;
        p = c.prototype;

        p.init = function (stg) {
            this.list = new Array();
            this.stage = stg;
        }

        p.onMouseDown = function (id, x, y) {
            var mouse = new flower.MouseInfo();
            mouse.id = id;
            mouse.startX = x;
            mouse.startY = y;
            mouse.mutiply = this.list.length == 0 ? false : true;
            this.list.push(mouse);
            var target = this.stage.getMouseTarget2(x, y, mouse.mutiply);
            mouse.target = target;
            target.addEventListener(flower.Event.REMOVE, this.onMouseTargetRemove, this);
            var eventList;
            var event = new flower.MouseEvent(flower.MouseEvent.MOUSE_DOWN);
            event.stageX = x;
            event.stageY = y;
            if (target) {
                event.target = target;
                var dis = target;
                eventList = [];
                while (dis) {
                    eventList.push(dis);
                    dis = dis.getParent();
                }
            }
            if (eventList) {
                while (eventList.length) {
                    event.currentTarget = eventList.shift();
                    event.mouseX = (event.currentTarget).getMouseX();
                    event.mouseY = (event.currentTarget).getMouseY();
                    event.currentTarget.dispatchEvent(event);
                }
            }
        }

        p.onMouseMove = function (id, x, y) {
            var mouse;
            for (var i = 0; i < this.list.length; i++) {
                if (this.list[i].id == id) {
                    mouse = this.list[i];
                    break;
                }
            }
            if (mouse == null) return;
            if (mouse.moveX == x && mouse.moveY == y) return;
            this.stage.getMouseTarget2(x, y, mouse.mutiply);
            mouse.moveX = x;
            mouse.moveY = y;
            var target = mouse.target;
            var eventList;
            var event = new flower.MouseEvent(flower.MouseEvent.MOUSE_MOVE);
            event.stageX = x;
            event.stageY = y;
            if (target) {
                event.target = target;
                var dis = target;
                eventList = [];
                while (dis) {
                    eventList.push(dis);
                    dis = dis.getParent();
                }
            }
            if (eventList) {
                while (eventList.length) {
                    event.currentTarget = eventList.shift();
                    event.mouseX = (event.currentTarget).getMouseX();
                    event.mouseY = (event.currentTarget).getMouseY();
                    event.currentTarget.dispatchEvent(event);
                }
            }
        }

        p.onMouseUp = function (id, x, y) {
            var mouse;
            for (var i = 0; i < this.list.length; i++) {
                if (this.list[i].id == id) {
                    mouse = this.list.splice(i, 1)[0];
                    break;
                }
            }
            if (mouse == null) return;
            var target = mouse.target;
            var eventList;
            var event = new flower.MouseEvent(flower.MouseEvent.CLICK);
            event.stageX = x;
            event.stageY = y;
            if (target) {
                event.target = target;
                var dis = target;
                eventList = [];
                while (dis) {
                    eventList.push(dis);
                    dis = dis.getParent();
                }
            }
            if (eventList) {
                while (eventList.length) {
                    event.currentTarget = eventList.shift();
                    event.mouseX = (event.currentTarget).getMouseX();
                    event.mouseY = (event.currentTarget).getMouseY();
                    event.currentTarget.dispatchEvent(event);
                }
            }
        }

        p.onMouseTargetRemove = function (e) {
            for (var i = 0; i < this.list.length; i++) {
                if (this.list[i].target == e.target) {
                    this.list.splice(i, 1)[0];
                    break;
                }
            }
        }

        MouseManager.ist = null;
        MouseManager.getInstance = function () {
            if (!MouseManager.ist) {
                MouseManager.ist = new MouseManager();
            }
            return MouseManager.ist;
        }

        return MouseManager;
    })();
    flower.MouseManager = MouseManager;
})(flower || (flower = {}));
