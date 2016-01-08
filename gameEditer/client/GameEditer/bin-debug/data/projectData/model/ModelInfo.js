/**
 *
 * @author
 *
 */
var ModelInfo = (function (_super) {
    __extends(ModelInfo, _super);
    function ModelInfo(url, name, desc) {
        _super.call(this, url, name, desc);
        this._logics = new eui.ArrayCollection();
        this._isNew = false;
    }
    var d = __define,c=ModelInfo;p=c.prototype;
    p.$setLogics = function (logics) {
        this._logics = logics;
    };
    d(p, "logics"
        ,function () {
            return this._logics;
        }
    );
    p.addLogic = function (logic) {
        this._logics.addItem(logic);
        this._isNew = false;
        this.dispatchEventWith(egret.Event.CHANGE);
    };
    d(p, "fileContent"
        ,function () {
            var list = {};
            for (var i = 0; i < this._logics.length; i++) {
                var logic = this._logics.getItemAt(i);
                list[logic.name] = logic.fileContent;
            }
            var config = {
                name: this._name,
                desc: this._desc,
                logic: list
            };
            return JSON.stringify(config);
        }
    );
    p.update = function (data) {
        this._name = data.name;
        this._logics = data._logics;
    };
    ModelInfo.decode = function (url, config) {
        if (config.name == null) {
            return null;
        }
        var data;
        try {
            data = new ModelInfo(url, config.name, config.desc);
            var logics = config.logic;
            var list = new eui.ArrayCollection();
            for (var key in logics) {
                var logicData = logics[key];
                var logic = new ModelLogicInfo(key, logicData.desc);
                logic.decode(logicData);
                if (logicData.params) {
                    for (var p = 0; p < logicData.params.length; p++) {
                        var param = new ParamInfo();
                        param.decode(logicData.params[p]);
                        logic.addParam(param);
                    }
                }
                if (logicData.return) {
                    var returnData = new ParamInfo();
                    returnData.decode(logicData.return);
                    logic.return = returnData;
                }
                list.addItem(logic);
            }
            data.$setLogics(list);
        }
        catch (e) {
            return null;
        }
        return data;
    };
    return ModelInfo;
})(FileInfoBase);
egret.registerClass(ModelInfo,"ModelInfo");
