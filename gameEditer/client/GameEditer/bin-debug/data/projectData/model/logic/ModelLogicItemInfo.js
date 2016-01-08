/**
 *
 * @author
 *
 */
var ModelLogicItemInfo = (function () {
    function ModelLogicItemInfo(type, id) {
        this._type = type;
        this._id = id;
    }
    var d = __define,c=ModelLogicItemInfo;p=c.prototype;
    d(p, "id"
        ,function () {
            return this._id;
        }
    );
    d(p, "type"
        ,function () {
            return this._type;
        }
    );
    d(p, "fileContent"
        ,function () {
            return null;
        }
    );
    p.decode = function (info) {
    };
    return ModelLogicItemInfo;
})();
egret.registerClass(ModelLogicItemInfo,"ModelLogicItemInfo");
