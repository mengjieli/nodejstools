/**
 *
 * @author
 *
 */
var Path = (function () {
    function Path() {
    }
    var d = __define,c=Path;p=c.prototype;
    Path.getPath = function (url) {
        var name = url.split("/")[url.split("/").length - 1];
        return url.slice(0, url.length - name.length - 1);
    };
    Path.getName = function (url) {
        var name = url.split("/")[url.split("/").length - 1];
        return name.split(".")[0];
    };
    Path.getFileFormat = function (url) {
        var name = url.split("/")[url.split("/").length - 1];
        if (name.split(".").length == 1)
            return null;
        return name.split(".")[name.split(".").length - 1];
    };
    return Path;
})();
egret.registerClass(Path,"Path");
