/**
 *
 * @author
 *
 */
var LocalFileInfo = (function () {
    function LocalFileInfo(url, type) {
        this.url = url;
        this.type = type;
    }
    var d = __define,c=LocalFileInfo;p=c.prototype;
    d(p, "loadPath"
        ,function () {
            return Config.localResourceServer + "/" + this.url;
        }
    );
    return LocalFileInfo;
})();
egret.registerClass(LocalFileInfo,"LocalFileInfo");
