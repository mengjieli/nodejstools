/**
 *
 * @author
 *
 */
var FileInfo = (function () {
    function FileInfo(url, name, format, end, type, status, depth) {
        this.hasLoad = false;
        this.virtual = false;
        this.url = url;
        this.name = name;
        this.format = format;
        this.end = end;
        this.type = type;
        this.status = status;
        this.depth = depth;
    }
    var d = __define,c=FileInfo;p=c.prototype;
    return FileInfo;
})();
egret.registerClass(FileInfo,"FileInfo");
