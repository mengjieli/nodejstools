/**
 *
 * @author
 *
 */
var FileInfoBase = (function (_super) {
    __extends(FileInfoBase, _super);
    function FileInfoBase(url, name, desc) {
        _super.call(this);
        this._isNew = true;
        this._url = url;
        this._name = name;
        this._desc = desc;
    }
    var d = __define,c=FileInfoBase;p=c.prototype;
    p.update = function (file) {
    };
    d(p, "isNew"
        ,function () {
            return this._isNew;
        }
    );
    d(p, "url"
        ,function () {
            return this._url + "/" + this._name + ".json";
        }
    );
    d(p, "name"
        ,function () {
            return this._name;
        }
    );
    d(p, "desc"
        ,function () {
            return this._desc;
        }
    );
    d(p, "fileContent"
        ,function () {
            var config = {
                "name": this._name,
                "desc": this._desc
            };
            return JSON.stringify(config);
        }
    );
    return FileInfoBase;
})(egret.EventDispatcher);
egret.registerClass(FileInfoBase,"FileInfoBase");
/**
 *
 * @author
 *
 */
var AniamationInfo = (function (_super) {
    __extends(AniamationInfo, _super);
    function AniamationInfo(url, name, desc) {
        _super.call(this, url, name, desc);
    }
    var d = __define,c=AniamationInfo;p=c.prototype;
    return AniamationInfo;
})(FileInfoBase);
egret.registerClass(AniamationInfo,"AniamationInfo");
