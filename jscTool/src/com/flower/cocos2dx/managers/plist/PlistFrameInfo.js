var flower;
(function (flower) {
    var PlistFrameInfo = (function () {
        /**
         name: null,
         x: null,
         y: null,
         width: null,
         height: null,
         offx: null,
         offy: null,
         rot: null,
         moveX: null,
         moveY: null,
         sourceWidth: null,
         sourceHeight: null,
         texture: null,
         count: null,
         * @constructor
         */
        function PlistFrameInfo() {
        }

        var d = __define, c = PlistFrameInfo;
        p = c.prototype;

        p.initBuffer = function () {
            this.count = 0;
        }

        p.cycle = function () {
            this.texture = null;
            BufferPool.cycle(ClassName.PlistFrameInfo, this, PlistFrameInfo.maxBuffer);
        }

        p.decode = function (xml) {
            var content;
            for (var i = 0; i < xml.list.length; i++) {
                if (xml.list[i].name == "key") {
                    content = xml.list[i + 1].value;
                    if (content) {
                        while (content.indexOf("{") != -1) {
                            content = content.slice(0, content.indexOf("{")) + content.slice(content.indexOf("{") + 1, content.length);
                        }
                        while (content.indexOf("}") != -1) {
                            content = content.slice(0, content.indexOf("}")) + content.slice(content.indexOf("}") + 1, content.length);
                        }
                    }
                    if (xml.list[i].value == "frame") {
                        this.x = parseInt(content.split(",")[0]);
                        this.y = parseInt(content.split(",")[1]);
                        this.width = parseInt(content.split(",")[2]);
                        this.height = parseInt(content.split(",")[3]);
                    }
                    else if (xml.list[i].value == "rotated") {
                        if (xml.list[i + 1].name == "true") this.rot = true;
                        else  this.rot = false;
                    }
                    else if (xml.list[i].value == "offset") {
                        this.offx = parseInt(content.split(",")[0]);
                        this.offy = parseInt(content.split(",")[1]);
                    }
                    else if (xml.list[i].value == "sourceSize") {
                        this.sourceWidth = parseInt(content.split(",")[0]);
                        this.sourceHeight = parseInt(content.split(",")[1]);
                    }
                    i++;
                }
            }
            this.moveX = this.offx + (this.sourceWidth - this.width) / 2;
            this.moveY = this.offy + (this.sourceHeight - this.height) / 2;
        }

        PlistFrameInfo.maxBuffer = 100;
        PlistFrameInfo.extend = extendClass;

        return PlistFrameInfo;
    })();
    flower.PlistFrameInfo = PlistFrameInfo;
})(flower || (flower = {}));
