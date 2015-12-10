var flower;
(function (flower) {
    var FileUtils = (function () {
        function FileUtils() {
        }

        var d = __define, c = FileUtils;
        p = c.prototype;

        FileUtils.readFile = function (url) {
            if (IDE.TYPE == 1) return xx.GameNet.readFile(url);
            var arr = xx.GameNet.readFile(url);
            return UTFChange.numberToString(arr);
        };

        return FileUtils;
    })();
    flower.FileUtils = FileUtils;
})(flower || (flower = {}));
