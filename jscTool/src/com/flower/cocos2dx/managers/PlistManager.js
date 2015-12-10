var flower;
(function (flower) {
    var PlistManager = (function () {
        function PlistManager() {
            this.plist = [];
            if (PlistManager.classLock == true) {
                flower.DebugInfo.debug("无法创建对象ResourceManager，此类为单例模式，请访问ResourceManager.getInstance()", flower.DebugInfo.WARN);
                return;
            }
        }

        var d = __define, c = PlistManager;
        p = c.prototype;

        p.getPlistFrame = function (name) {
            var len1 = this.plist.length;
            var len2;
            for (var i = 0; i < len1; i++) {
                len2 = this.plist[i].frames.length;
                for (var j = 0; j < len2; j++) {
                    if (this.plist[i].frames[j].name == name) {
                        return this.plist[i].frames[j];
                    }
                }
            }
            return null;
        }

        p.getPlist = function (url) {
            var len1 = this.plist.length;
            for (var i = 0; i < len1; i++) {
                if (this.plist[i].url == url) {
                    return this.plist[i];
                }
            }
            return null;
        }

        p.addPlist = function (url) {
            for (var i = 0; i < this.plist.length; i++) {
                if (this.plist[i].url == url) {
                    return this.plist[i];
                }
            }
            var info = new flower.PlistInfo(url);
            flower.DebugInfo.debug("|加载plist| " + url, flower.DebugInfo.TIP);
            this.plist.push(info);
            return info;
        }

        p.delPlist = function (url) {
            var info;
            for (var i = 0; i < this.plist.length; i++) {
                if (this.plist[i].url == url) {
                    info = this.plist.splice(i, 1)[0];
                    break;
                }
            }
            if (!info) {
                flower.flower.DebugInfo.debug("|删除plist文件| 没有找到对应的plist信息 ", flower.DebugInfo.WARN);
                return;
            }
            info.cycle();
            flower.DebugInfo.debug("|删除plist| " + url, flower.DebugInfo.TIP);
        }

        PlistManager.ist;
        PlistManager.classLock = true;

        PlistManager.getInstance = function () {
            if (!PlistManager.ist) {
                PlistManager.classLock = false;
                PlistManager.ist = new PlistManager();
                PlistManager.classLock = true;
            }
            return PlistManager.ist;
        };

        return PlistManager;
    })();
    flower.PlistManager = PlistManager;
})(flower || (flower = {}));
