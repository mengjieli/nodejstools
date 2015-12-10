var jc;
(function (jc) {
    var XMLElement = (function () {
        function XMLElement() {
            this.attributes = [];
            this.list = [];
        }

        var d = __define, c = XMLElement;
        p = c.prototype;

        p.getElementByAttribute = function (atrName, value) {
            for (var i = 0; i < this.list.length; i++) {
                for (var a = 0; a < this.list[i].attributes.length; a++) {
                    if (this.list[i].attributes[a].name == atrName && this.list[i].attributes[a].value == value) {
                        return this.list[i];
                    }
                }
            }
            return null;
        }

        p.decode = function (content) {
            var delStart = -1;
            for (var i = 0; i < content.length; i++) {
                if (content.charAt(i) == "\r" || content.charAt(i) == "\n") {
                    content = content.slice(0, i) + content.slice(i + 1, content.length);
                    i--;
                }
                if (delStart == -1 && (content.slice(i, i + 2) == "<!" || content.slice(i, i + 2) == "<?")) {
                    delStart = i;
                }
                if (delStart != -1 && content.charAt(i) == ">") {
                    content = content.slice(0, delStart) + content.slice(i + 1, content.length);
                    i = i - (i - delStart + 1);
                    delStart = -1;
                }
            }
            this.readInfo(content);
        }

        p.readInfo = function (content, startIndex) {
            startIndex = startIndex == null ? 0 : startIndex;
            var leftSign = -1;
            var len = content.length;
            var c;
            var j;
            for (var i = startIndex; i < len; i++) {
                c = content.charAt(i);
                if (c == "<") {
                    for (j = i + 1; j < len; j++) {
                        c = content.charAt(j);
                        if (c != " " && c != "\t") {
                            i = j;
                            break;
                        }
                    }
                    for (j = i + 1; j < len; j++) {
                        c = content.charAt(j);
                        if (c == " " || c == "\t" || c == "/" || c == ">") {
                            this.name = content.slice(i, j);
                            i = j;
                            break;
                        }
                    }
                    break;
                }
            }
            var end = false;
            var attribute;
            for (; i < len; i++) {
                c = content.charAt(i);
                if (c == "/") {
                    end = true;
                }
                else if (c == ">") {
                    i++;
                    break;
                }
                else if (c == " " || c == "\t") {
                }
                else {
                    for (j = i + 1; j < len; j++) {
                        c = content.charAt(j);
                        if (c == "=" || c == " " || c == "\t") {
                            attribute = new jc.XMLAttribute();
                            this.attributes.push(attribute);
                            attribute.name = content.slice(i, j);
                            break;
                        }
                    }
                    j++;
                    var startSign;
                    for (; j < len; j++) {
                        c = content.charAt(j);
                        if (c == "\"" || c == "'") {
                            i = j + 1;
                            startSign = c;
                            break;
                        }
                    }
                    j++;
                    for (; j < len; j++) {
                        c = content.charAt(j);
                        if (c == startSign && content.charAt(j - 1) != "\\") {
                            attribute.value = content.slice(i, j);
                            i = j;
                            break;
                        }
                    }
                }
            }
            if (end == true) return i;
            var contentStart;
            for (; i < len; i++) {
                c = content.charAt(i);
                if (c != " " && c != "\t") {
                    contentStart = i;
                    i--;
                    break;
                }
            }
            for (; i < len; i++) {
                c = content.charAt(i);
                if (c == "<") {
                    for (j = i + 1; j < len; j++) {
                        c = content.charAt(j);
                        if (c != " " && c != "\t") {
                            break;
                        }
                    }
                    if (c == "/") {
                        for (j = i + 1; j < len; j++) {
                            c = content.charAt(j);
                            if (c == " " || c == "\t" || c == ">") {
                                var endName = content.slice(i + 2, j);
                                if (endName != this.name) {
                                    cc.log("开始标签和结尾标签不一致，开始标签：" + this.name + " ，结尾标签：" + endName);
                                }
                                break;
                            }
                        }
                        if (this.list.length == 0) {
                            i--;
                            for (; i >= 0; i--) {
                                c = content.charAt(i);
                                if (c != " " && c != "\t") {
                                    break;
                                }
                            }
                            this.value = content.slice(contentStart, i + 1);
                        }
                        for (; j < len; j++) {
                            c = content.charAt(j);
                            if (c == ">") {
                                i = j + 1;
                                break;
                            }
                        }
                        end = true;
                        break;
                    }
                    else {
                        var element = new XMLElement();
                        element.name = endName;
                        this.list.push(element);
                        i = element.readInfo(content, i) - 1;
                    }
                }
            }
            return i;
        }

        return XMLElement;
    })();
    jc.XMLElement = XMLElement;
})(jc || (jc = {}));
