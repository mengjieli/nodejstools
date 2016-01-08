/**
 *
 * @author 
 *
 */
class ModelInfo extends FileInfoBase {
    
    private _logics: eui.ArrayCollection;
    
    public constructor(url,name,desc) {
        super(url,name,desc);
        this._logics = new eui.ArrayCollection();
        this._isNew = false;
	}
	
	public $setLogics(logics:eui.ArrayCollection):void {
        this._logics = logics;
	}
	
    public get logics():eui.ArrayCollection {
        return this._logics;
    }
    
    public addLogic(logic:ModelLogicInfo):void {
        this._logics.addItem(logic);
        this._isNew = false;
        this.dispatchEventWith(egret.Event.CHANGE);
    }
	
    public get fileContent(): string {
        var list = {};
        for(var i = 0;i < this._logics.length; i++) {
            var logic:ModelLogicInfo = this._logics.getItemAt(i);
            list[logic.name] = logic.fileContent;
        }
        var config = {
            name: this._name,
            desc: this._desc,
            logic: list
        }
        return JSON.stringify(config);
    }
    
    public update(data:ModelInfo):void {
        this._name = data.name;
        this._logics = data._logics;
    }
    
    public static decode(url,config): ModelInfo {
        if(config.name == null) {
            return null;
        }
        var data;
        try {
            data = new ModelInfo(url,config.name,config.desc);
            var logics = config.logic;
            var list: eui.ArrayCollection = new eui.ArrayCollection();
            for(var key in logics) {
                var logicData = logics[key];
                var logic = new ModelLogicInfo(key,logicData.desc);
                logic.decode(logicData);
                if(logicData.params) {
                    for(var p = 0;p < logicData.params.length; p++) {
                        var param = new ParamInfo();
                        param.decode(logicData.params[p]);
                        logic.addParam(param);
                    }
                }
                if(logicData.return) {
                    var returnData = new ParamInfo();
                    returnData.decode(logicData.return);
                    logic.return = returnData;
                }
                list.addItem(logic);
            }
            data.$setLogics(list);
        } catch(e) {
            return null;
        }
        return data;
    }
}
