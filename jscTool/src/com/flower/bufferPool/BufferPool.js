var flower;
(function (flower) {
    var BufferPool = (function () {
        function BufferPool() {
        }

        var d = __define, c = BufferPool, p = c.prototype;

        BufferPool.pool = {};
        BufferPool.create = function (className, cls) {
            var obj;
            //trace("取对象", className, BufferPool.pool[className] ? BufferPool.pool[className].length : 0);
            if (!BufferPool.pool[className]) BufferPool.pool[className] = [];
            if (BufferPool.pool[className].length) obj = BufferPool.pool[className].pop();
            if (obj == null) obj = new cls();
            if ((IDE.TYPE == 1 && obj.hasOwnProperty("initBuffer")) || (IDE.TYPE == 2 && obj["initBuffer"])) {
                obj.initBuffer.apply(obj);
            }
            return obj;
        };
        BufferPool.cycle = function (className, obj, max) {
            max = max == null ? 1000 : max;
            if (!BufferPool.pool[className]) BufferPool.pool[className] = [];
            if ((IDE.TYPE == 1 && obj.hasOwnProperty("cycleBuffer")) || (IDE.TYPE == 2 && obj["cycleBuffer"])) {
                obj.cycleBuffer();
            }
            //trace("存对象", BufferPool.pool[className].length, max);
            if (BufferPool.pool[className].length >= max) return;
            BufferPool.pool[className].push(obj);
            //trace("存对象", className, BufferPool.pool[className] ? BufferPool.pool[className].length : 0);
        };
        BufferPool.createCCNode = function (className) {
            var args = [];
            for (var key in arguments) {
                if (key >= 1) args.push(arguments[key]);
            }

            var node;
            if (!BufferPool.pool[className]) BufferPool.pool[className] = [];
            if (BufferPool.pool[className].length) node = BufferPool.pool[className].pop();
            if (node == null) {
                if (className == ClassName.CCNode) node = new cc.Node();
                else if (className == ClassName.CCSprite) node = new cc.Sprite();
                else if (className == ClassName.CCLabelTTF) node = cc.LabelTTF.create.apply(null, args);
                else if (className == ClassName.CCDrawNode) node = cc.DrawNode.create();
                node.retain();
            }
            return node;
        };
        BufferPool.cycyleCCNode = function (node, className) {
            if (!BufferPool.pool[className]) BufferPool.pool[className] = [];
            var max;
            if (className == ClassName.CCNode) max = BufferPool.CCNodeMax;
            else if (className == ClassName.CCSprite) max = BufferPool.CCSpriteMax;
            else if (className == ClassName.CCLabelTTF) max = BufferPool.CCLabelTTFMax;
            else if (className == ClassName.CCDrawNode) max = BufferPool.CCDrawNodeMax;
            max = 0;
            if (true) {
                node.release();
                return;
            }
            BufferPool.pool[className].push(node);
        };
        BufferPool.createCCObject = function (className) {
            var node;
            if (!BufferPool.pool[className]) BufferPool.pool[className] = [];
            if (BufferPool.pool[className].length) node = BufferPool.pool[className].pop();
            if (node == null) {
                if (className == ClassName.CCPoint) node = cc.p(0, 0);
                else if (className == ClassName.CCSize) node = cc.size(0, 0);
                else if (className == ClassName.CCRect) node = cc.rect(0, 0, 0, 0);
                else if (className == ClassName.CCColor) node = cc.c3b(0, 0, 0);
                else if (className == ClassName.CCColor4) node = cc.c4f(0, 0, 0, 0);
            }
            return node;
        };
        BufferPool.cycyleCCObject = function (node, className) {
            if (!BufferPool.pool[className]) BufferPool.pool[className] = [];
            var max;
            if (className == ClassName.CCNode) max = BufferPool.CCNodeMax;
            else if (className == ClassName.CCSprite) max = BufferPool.CCSpriteMax;
            if (BufferPool.pool[className].length > max) {
                return;
            }
            BufferPool.pool[className].push(node);
        };

        BufferPool.CCPoint = 500;
        BufferPool.CCRect = 300;
        BufferPool.CCSize = 300;
        BufferPool.CCNodeMax = 500;
        BufferPool.CCSpriteMax = 1000;
        BufferPool.CCLabelTTFMax = 100;
        BufferPool.CCDrawNodeMax = 50;
        BufferPool.CCSBase = 0;
        BufferPool.CCSPanel = 100;
        BufferPool.CCSImageView = 300;
        BufferPool.CCSLabel = 300;
        BufferPool.CCSLabelAtlas = 100;
        BufferPool.CCSButton = 50;
        BufferPool.CCSCheckBox = 20;
        BufferPool.CCSList = 5;
        BufferPool.DisplayObjectMax = 0;
        BufferPool.DisplayObjectContainerMax = 300;
        BufferPool.BitmapMax = 800;
        BufferPool.TextFieldMax = 80;
        BufferPool.GraphicsMax = 50;

        return BufferPool;
    })();
    flower.BufferPool = BufferPool;
})(flower || (flower = {}));
