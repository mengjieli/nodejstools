/**
 *
 * @author
 *
 */
var ParamInfo = (function () {
    function ParamInfo() {
    }
    var d = __define,c=ParamInfo;p=c.prototype;
    p.decode = function (info) {
        this.name = info.name;
        this.desc = info.desc;
        this.type = new TypeInfo(info.type.type, info.type.typeValue);
        this.init = info.init;
    };
    return ParamInfo;
})();
egret.registerClass(ParamInfo,"ParamInfo");
