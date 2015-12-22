/**
 *
 * @author
 *
 */
var FileInfoBase = (function () {
    function FileInfoBase(url, name, desc) {
        this._url = url;
        this.name = name;
        this.desc = desc;
    }
    var d = __define,c=FileInfoBase;p=c.prototype;
    d(p, "url"
        ,function () {
            return this._url + "/" + this.name + ".json";
        }
    );
    d(p, "fileContent"
        ,function () {
            var config = {
                "name": this.name,
                "desc": this.desc
            };
            return JSON.stringify(config);
        }
    );
    return FileInfoBase;
})();
egret.registerClass(FileInfoBase,"FileInfoBase");
/**
 *
 * @author
 *
 */
var AniamationInfo = (function () {
    function AniamationInfo() {
    }
    var d = __define,c=AniamationInfo;p=c.prototype;
    return AniamationInfo;
})();
egret.registerClass(AniamationInfo,"AniamationInfo");
