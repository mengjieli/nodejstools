/**
 *
 * @author
 *
 */
var DataInfoMember = (function () {
    function DataInfoMember(desc, type, typeValue) {
    }
    var d = __define,c=DataInfoMember;p=c.prototype;
    return DataInfoMember;
})();
egret.registerClass(DataInfoMember,"DataInfoMember");
var DataInfo = (function (_super) {
    __extends(DataInfo, _super);
    function DataInfo(url, name, desc) {
        _super.call(this, url, name, desc);
        this.members = [];
    }
    var d = __define,c=DataInfo;p=c.prototype;
    d(p, "fileContent"
        ,function () {
            var config = {
                "name": this.name,
                "desc": this.desc,
                "members": this.members
            };
            return JSON.stringify(config);
        }
    );
    p.update = function (data) {
        this._name = data.name;
    };
    DataInfo.decode = function (url, config) {
        if (config.name == null || config.members == null) {
            return null;
        }
        var members = [];
        try {
            for (var name in config.members) {
                var desc = config.members[name].desc;
                desc = desc || "";
            }
        }
        catch (e) {
            return null;
        }
        var data = new DataInfo(url, config.name, config.desc);
        data.members = members;
        return data;
    };
    return DataInfo;
})(FileInfoBase);
egret.registerClass(DataInfo,"DataInfo");
