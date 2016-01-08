/**
 *
 * @author 
 *
 */
class ModelLogicInfo extends egret.EventDispatcher{
    
    public static ADD_LOGIC:string = "add_logic";
    public static DEL_LOGIC:string = "del_logic";
    
    private _name:string;
    private _desc: string;
    private _items: Array<ModelLogicItemInfo>;
    private _params: Array<ParamInfo>;
    private _return: ParamInfo;
    public max:number = 0;
    public start:number = 0;
    
    //临时
    public vars:eui.ArrayCollection = new eui.ArrayCollection();
    
	public constructor(name:string,desc:string) {
    	super();
        this._name = name;
        this._desc = desc;
        this._params = [];
        this._return = null;
        this._items = [];
    }
    
    public addParam(param:ParamInfo):void {
        this._params.push(param);
    }

    public get paramCount(): number {
        return this._params.length;
    }

    public getParamAt(index: number): ParamInfo {
        return this._params[index];
    }

    public get return(): ParamInfo {
        return this._return;
    }

    public set return(val: ParamInfo) {
        this._return = val;
    }
	
	public get name():string {
        return this._name;
	}
	
	public set name(val:string) {
        this._name = val;
	}
	
	public get desc():string {
        return this._desc == "" || this._desc == null ? this._name : this._desc;
	}
	
    public set desc(val:string) {
        this._desc = val;
    }
	
	public get items():Array<ModelLogicItemInfo> {
        return this._items;
	}
	
	public get fileContent():Object {
    	var res:any = 
        {
            desc: this.desc,
            max:this.max,
            start:this.start,
            logics:[]
        }
        if(this.paramCount) {
            res.params = [];
            for(var p = 0;p < this.paramCount;p++) {
                var param = this.getParamAt(p);
                var paramInfo = {
                    "desc": param.desc,
                    "type": {
                        "type": param.type.type,
                        "typeValue": param.type.typeValue ? param.type.typeValue : ""
                    }
                }
                if(param.init) {
                    paramInfo["init"] = param.init;
                }
                res.params.push(paramInfo);
            }
        }
        if(this.return) {
            var returnInfo = this.return;
            res.return = {
                "desc": returnInfo.desc,
                "type": {
                    "type": returnInfo.type.type,
                    "typeValue": returnInfo.type.typeValue ? returnInfo.type.typeValue : ""
                }
            }
        }
        for(var i = 0; i < this._items.length; i++) {
            res.logics.push(this._items[i].fileContent);
        }
	    return res;
    }

    public decode(info: any): void {
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
        for(var i = 0; i < info.logics.length; i ++) {
            var itemInfo = info.logics[i];
            var item:ModelLogicItemInfo;
            if(itemInfo.type == LogicType.DEFINE) {
                item = new ModelLogicDefine(itemInfo.id);
            } else if(itemInfo.type == LogicType.CALL_API) {
                item = new ModelLogicCallAPI(itemInfo.id);
            }
            item.decode(itemInfo);
            this._items.push(item);
        }
    }
	
	public getNewLogic(type:string):ModelLogicItemInfo {
    	  var val:ModelLogicItemInfo;
    	  if(type == LogicType.DEFINE) {
    	      val = new ModelLogicDefine(++this.max);
    	  }
	    return val;
	}
	
	public addLogic(val:ModelLogicItemInfo):void {
	    this._items.push(val);
	    if(this._items.length == 1) {
	        this.start = val.id;
	    }
	    this.dispatchEventWith(ModelLogicInfo.ADD_LOGIC,false,val);
	}
	
	public getLogic(id:number):ModelLogicItemInfo {
	    for(var i = 0; i < this._items.length; i++) {
	        if(this._items[i].id == id) {
	            return this._items[i];
	        }
	    }
	    return null;
	}
}
