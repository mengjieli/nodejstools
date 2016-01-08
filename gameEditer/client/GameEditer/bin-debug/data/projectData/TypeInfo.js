/**
 *
 * @author
 *
 */
var TypeInfo = (function () {
    function TypeInfo(type, typeValue) {
        if (typeValue === void 0) { typeValue = null; }
        this.type = type;
        this.typeValue = typeValue;
    }
    var d = __define,c=TypeInfo;p=c.prototype;
    d(p, "desc"
        ,function () {
            var d = DataConfig.typeDesc[this.type];
            if (d) {
                return d;
            }
            return this.type;
        }
    );
    d(p, "fileContent"
        ,function () {
            return {
                type: this.type,
                typeValue: this.typeValue
            };
        }
    );
    return TypeInfo;
})();
egret.registerClass(TypeInfo,"TypeInfo");
