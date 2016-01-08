/**
 *
 * @author
 *
 */
var ModelLogicInfo = (function (_super) {
    __extends(ModelLogicInfo, _super);
    function ModelLogicInfo(name, desc) {
        _super.call(this);
        this.max = 0;
        this.start = 0;
        //临时
        this.vars = new eui.ArrayCollection();
        this._name = name;
        this._desc = desc;
        this._params = [];
        this._return = null;
        this._items = [];
    }
    var d = __define,c=ModelLogicInfo;p=c.prototype;
    p.addParam = function (param) {
        this._params.push(param);
    };
    d(p, "paramCount"
        ,function () {
            return this._params.length;
        }
    );
    p.getParamAt = function (index) {
        return this._params[index];
    };
    d(p, "return"
        ,function () {
            return this._return;
        }
        ,function (val) {
            this._return = val;
        }
    );
    d(p, "name"
        ,function () {
            return this._name;
        }
        ,function (val) {
            this._name = val;
        }
    );
    d(p, "desc"
        ,function () {
            return this._desc == "" || this._desc == null ? this._name : this._desc;
        }
        ,function (val) {
            this._desc = val;
        }
    );
    d(p, "items"
        ,function () {
            return this._items;
        }
    );
    d(p, "fileContent"
        ,function () {
            var res = {
                desc: this.desc,
                max: this.max,
                start: this.start,
                logics: []
            };
            if (this.paramCount) {
                res.params = [];
                for (var p = 0; p < this.paramCount; p++) {
                    var param = this.getParamAt(p);
                    var paramInfo = {
                        "desc": param.desc,
                        "type": {
                            "type": param.type.type,
                            "typeValue": param.type.typeValue ? param.type.typeValue : ""
                        }
                    };
                    if (param.init) {
                        paramInfo["init"] = param.init;
                    }
                    res.params.push(paramInfo);
                }
            }
            if (this.return) {
                var returnInfo = this.return;
                res.return = {
                    "desc": returnInfo.desc,
                    "type": {
                        "type": returnInfo.type.type,
                        "typeValue": returnInfo.type.typeValue ? returnInfo.type.typeValue : ""
                    }
                };
            }
            for (var i = 0; i < this._items.length; i++) {
                res.logics.push(this._items[i].fileContent);
            }
            return res;
        }
    );
    p.decode = function (info) {
        /*{
            "desc": "加载",
            "max": 1,
            "start": 1,
            "logics": [
                {
                    "id": 1,
                    "type": "define",
                    "name": "aaa",
                    "desc": "define",
                    "varType": {
                        "type": "int",
                        "typeValue": null
                    },
                    "init": null
                }
            ]
        }*/
        this.max = info.max;
        this.start = info.start;
        for (var i = 0; i < info.logics.length; i++) {
            var itemInfo = info.logics[i];
            var item;
            if (itemInfo.type == LogicType.DEFINE) {
                item = new ModelLogicDefine(itemInfo.id);
            }
            else if (itemInfo.type == LogicType.CALL_API) {
                item = new ModelLogicCallAPI(itemInfo.id);
            }
            item.decode(itemInfo);
            this._items.push(item);
        }
    };
    p.getNewLogic = function (type) {
        var val;
        if (type == LogicType.DEFINE) {
            val = new ModelLogicDefine(++this.max);
        }
        return val;
    };
    p.addLogic = function (val) {
        this._items.push(val);
        if (this._items.length == 1) {
            this.start = val.id;
        }
        this.dispatchEventWith(ModelLogicInfo.ADD_LOGIC, false, val);
    };
    p.getLogic = function (id) {
        for (var i = 0; i < this._items.length; i++) {
            if (this._items[i].id == id) {
                return this._items[i];
            }
        }
        return null;
    };
    ModelLogicInfo.ADD_LOGIC = "add_logic";
    ModelLogicInfo.DEL_LOGIC = "del_logic";
    return ModelLogicInfo;
})(egret.EventDispatcher);
egret.registerClass(ModelLogicInfo,"ModelLogicInfo");
