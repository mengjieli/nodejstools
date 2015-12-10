var jc;
(function (jc) {
    var JSONDecoder = (function () {
        function JSONDecoder(content) {
            this.decode(content);
        }

        var d = __define, c = JSONDecoder;
        p = c.prototype;

        p.decode = function (content) {
            this._content = content;
            this._json = this.decodeObject();
        }

        p.decodeObject = function () {
            if (this._content.charAt(this._pos) == "{") this._pos++;
            var res = {};
            var value;
            var chars;
            while (this._pos != this._content.length) {
                var nameStart = this._content.indexOf("\"", this._pos);
                var nameEnd = this._content.indexOf("\"", nameStart + 1);
                var name = this._content.slice(nameStart + 1, nameEnd);
                this._pos = nameEnd + 1;
                this._pos = this._content.indexOf(":", this._pos) + 1;
                var type = this.getType();
                while (type == JSONDecoder.WHITE) {
                    this._pos++;
                    type = this.getType();
                }
                if (type == JSONDecoder.EMPTY) {
                    res[name] = null;
                    this._pos += 4;
                }
                else if (type == JSONDecoder.TRUE) {
                    res[name] = true;
                    this._pos += 4;
                }
                else if (type == JSONDecoder.FALSE) {
                    res[name] = false;
                    this._pos += 5;
                }
                else if (type == JSONDecoder.OBJECT) {
                    res[name] = this.decodeObject();
                }
                else if (type == JSONDecoder.ARRAY) {
                    res[name] = this.decodeArray();
                }
                else if (type == JSONDecoder.NUMBER) {
                    res[name] = this.decodeNumber();
                }
                else if (type == JSONDecoder.STRING) {
                    this._pos++;
                    res[name] = this.decodeString();
                }
                type = this.getType();
                while (type == JSONDecoder.WHITE) {
                    this._pos++;
                    type = this.getType();
                }
                if (type == JSONDecoder.DEVICE) {
                    this._pos++;
                }
                else if (type == JSONDecoder.OBJECT_END) {
                    this._pos++;
                    break;
                }
                else {
                    cc.log("没有找到下一个属性或Object结束符号：" + this._content.slice(this._pos - 10, this._pos));
                }
            }
            return res;
        }

        p.decodeArray = function () {
            if (this._content.charAt(this._pos) == "[") this._pos++;
            var res = [];
            var value;
            var chars;
            while (this._pos != this._content.length) {
                var type = this.getType();
                while (type == JSONDecoder.WHITE) {
                    this._pos++;
                    type = this.getType();
                }
                if (type == JSONDecoder.EMPTY) {
                    res.push(null);
                    this._pos += 4;
                }
                else if (type == JSONDecoder.TRUE) {
                    res.push(true);
                    this._pos += 4;
                }
                else if (type == JSONDecoder.FALSE) {
                    res.push(false);
                    this._pos += 5;
                }
                else if (type == JSONDecoder.OBJECT) {
                    res.push(this.decodeObject());
                }
                else if (type == JSONDecoder.ARRAY) {
                    res.push(this.decodeArray());
                }
                else if (type == JSONDecoder.NUMBER) {
                    res.push(this.decodeNumber());
                }
                else if (type == JSONDecoder.STRING) {
                    this._pos++;
                    res.push(this.decodeString());
                }
                type = this.getType();
                while (type == JSONDecoder.WHITE) {
                    this._pos++;
                    type = this.getType();
                }
                if (type == JSONDecoder.DEVICE) {
                    this._pos++;
                }
                else if (type == JSONDecoder.ARRAY_END) {
                    this._pos++;
                    break;
                }
                else {
                    cc.log("没有找到下一个属性或Array结束符号：" + this._content.slice(this._pos - 10, this._pos));
                }
            }
            return res;
        }

        p.decodeNumber = function () {
            var value = "";
            var chars;
            for (; this._pos < this._content.length; this._pos++) {
                chars = this._content.charAt(this._pos);
                if (chars == "-" || chars == "0" || chars == "1" || chars == "2" || chars == "3" || chars == "4" || chars == "5" || chars == "6" || chars == "7" || chars == "8" || chars == "9" || chars == ".") {
                    value += chars;
                }
                else {
                    break;
                }
            }
            return parseFloat(value);
        }

        p.decodeString = function () {
            var chars;
            var value = "";
            for (; this._pos < this._content.length; this._pos++) {
                chars = this._content.charAt(this._pos);
                if (chars == "\\") {
                    value += this._content.slice(this._pos, this._pos + 2);
                    this._pos++;
                }
                else {
                    if (chars == "\"") {
                        this._pos++;
                        break;
                    }
                    value += chars;
                }
            }
            return value;
        }

        p.getType = function () {
            var chars = this._content.charAt(this._pos);
            if (chars == "\t" || chars == " " || chars == "\r" || chars == "\n") return JSONDecoder.WHITE;
            if (chars == ",") return JSONDecoder.DEVICE;
            if (chars == "{") return JSONDecoder.OBJECT;
            if (chars == "}") return JSONDecoder.OBJECT_END;
            if (chars == "[") return JSONDecoder.ARRAY;
            if (chars == "]") return JSONDecoder.ARRAY_END;
            if (chars == "-" || chars == "0" || chars == "1" || chars == "2" || chars == "3" || chars == "4" || chars == "5" || chars == "6" || chars == "7" || chars == "8" || chars == "9") return JSONDecoder.NUMBER;
            if (chars == "\"") return JSONDecoder.STRING;
            if (chars == "t" && this._content.slice(this._pos, this._pos + 4) == "true") return JSONDecoder.TRUE;
            if (chars == "f" && this._content.slice(this._pos, this._pos + 5) == "false") return JSONDecoder.FALSE;
            if (chars == "n" && this._content.slice(this._pos, this._pos + 4) == "null") return JSONDecoder.EMPTY;
            return JSONDecoder.UNKNOW;
        }

        p.getValue = function () {
            return this._json;
        }

        JSONDecoder.UNKNOW = 0;
        JSONDecoder.WHITE = 1;
        JSONDecoder.OBJECT = 2;
        JSONDecoder.OBJECT_END = 21;
        JSONDecoder.ARRAY = 3;
        JSONDecoder.ARRAY_END = 31;
        JSONDecoder.NUMBER = 4;
        JSONDecoder.STRING = 5;
        JSONDecoder.EMPTY = 6;
        JSONDecoder.DEVICE = 7;
        JSONDecoder.TRUE = 8;
        JSONDecoder.FALSE = 9;

        return JSONDecoder;
    })();
    jc.JSONDecoder = JSONDecoder;
})(jc || (jc = {}));
