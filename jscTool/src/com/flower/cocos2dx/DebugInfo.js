var flower;
(function (flower) {
    var DebugInfo = (function () {
        function DebugInfo() {
        }

        var d = __define, c = DebugInfo;
        p = c.prototype;

        DebugInfo.NONE = 0;
        DebugInfo.WARN = 1;
        DebugInfo.ERROR = 2;
        DebugInfo.TIP = 3;
        DebugInfo.debug = function (str, type) {
            type = type == null ? 0 : type;
            if (type == 1 && flower.Flower.warnInfo == false) return;
            if (type == 2 && flower.Flower.errorInfo == false) return;
            if (type == 3 && flower.Flower.tipInfo == false) return;
            if (type == 1) str = "[警告]  " + str;
            if (type == 2) str = "[错误] " + str;
            if (type == 3) str = "[提示] " + str;
            cc.log(str);
            if (type == 2) {
                throw str;
                //flower.ErrorDispatch.dispatch(str);
            }
        };
        DebugInfo.debug2 = function (type) {
            var args = [];
            for (var key in arguments) {
                if (key >= 1) args.push(arguments[key]);
            }

            var str = "";
            for (var i = 0; i < args.length; i++) {
                str += args[i] + "\t";
            }
            DebugInfo.debug(str, type);
        };

        return DebugInfo;
    })();
    flower.DebugInfo = DebugInfo;
})(flower || (flower = {}));

