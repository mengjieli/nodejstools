/**
 *
 * @author
 *
 */
var DataInfoMember = (function () {
    function DataInfoMember() {
    }
    var d = __define,c=DataInfoMember;p=c.prototype;
    return DataInfoMember;
})();
egret.registerClass(DataInfoMember,"DataInfoMember");
var DataInfo = (function (_super) {
    __extends(DataInfo, _super);
    function DataInfo(url, name, desc) {
        _super.call(this, url, name, desc);
        this.members = {};
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
    return DataInfo;
})(FileInfoBase);
egret.registerClass(DataInfo,"DataInfo");
