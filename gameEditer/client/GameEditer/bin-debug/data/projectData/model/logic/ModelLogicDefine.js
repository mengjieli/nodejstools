/**
 *
 * @author
 *
 */
var ModelLogicDefine = (function (_super) {
    __extends(ModelLogicDefine, _super);
    function ModelLogicDefine(id) {
        _super.call(this, LogicType.DEFINE, id);
    }
    var d = __define,c=ModelLogicDefine;p=c.prototype;
    d(p, "fileContent"
        ,function () {
            return {
                id: this.id,
                type: this.type,
                next: this.next,
                name: this.name,
                desc: this.desc,
                varType: this.varType.fileContent,
                init: this.init
            };
        }
    );
    p.decode = function (info) {
        this.next = info.next;
        this.name = info.name;
        this.desc = info.desc;
        this.varType = new TypeInfo(info.varType.type, info.varType.typeValue);
        this.init = info.init;
    };
    return ModelLogicDefine;
})(ModelLogicItemInfo);
egret.registerClass(ModelLogicDefine,"ModelLogicDefine");
