/**
 *
 * @author 
 *
 */
class ModelEditer extends eui.Component {
    
    private toolbar: ModelLogicToolBar;
    private bg: egret.Shape;
    private content: egret.Sprite;
    private data: ModelLogicInfo;
    private title: eui.Label;
    private startx = 100;
    private starty = 120;
    private varList: VarList;
    
	public constructor() {
        super();
        
        this.varList = new VarList();
        this.addChild(this.varList);
        this.varList.height = 70;
        
        this.bg = new egret.Shape();
        this.addChild(this.bg);
        this.bg.y = this.varList.height;
        
        this.content = new egret.Sprite();
        this.content.x = this.startx;
        this.content.y = this.starty;
        this.addChild(this.content);
        
        this.title = new eui.Label();
        this.title.size = 14;
        this.title.textColor = 0x999999;
        this.title.x = 5;
        this.title.y = 80;
        this.addChild(this.title);
	}
	
    public validateDisplayList():void {
        super.validateDisplayList();
        this.bg.graphics.clear();
        this.bg.graphics.beginFill(0x222222);
        this.bg.graphics.drawRect(0,0,this.width,this.height - 40);
        this.bg.graphics.endFill();
        this.varList.width = this.width - this.varList.x;
    }
    
    public showLogic(logic:ModelLogicInfo):void {
        if(logic == this.data) {
            return;
        }
        if(this.data) {
            this.data.removeEventListener(ModelLogicInfo.ADD_LOGIC,this.flush,this);
            this.data.removeEventListener(ModelLogicInfo.DEL_LOGIC,this.flush,this);
        }
        this.data = logic;
        this.data.addEventListener(ModelLogicInfo.ADD_LOGIC,this.flush,this);
        this.data.addEventListener(ModelLogicInfo.DEL_LOGIC,this.flush,this);
        this.varList.dataProvider = logic.vars;
        this.title.text = logic.desc;
        this.flush();
    }
    
    private flush(e:egret.Event=null):void {
        while(this.content.numChildren) {
            this.content.removeChildAt(0);
        }
        if(this.data.items.length) {
            var itemData = this.data.getLogic(this.data.start);
            var item = ModelEditer.getNetLogicItem(this.data,itemData);
            this.content.addChild(item);
        } else {
            var item = ModelEditer.getNetLogicItem(this.data);
            this.content.addChild(item);
        }
    }
    
    public static getNetLogicItem(data:ModelLogicInfo,item:ModelLogicItemInfo=null,parentLogic:ModelLogicItemInfo=null):LogicItemBase {
        if(item == null) {
            return new LogicItemNew(data,parentLogic);
        }
        if(item.type == LogicType.DEFINE) {
            return new LogicItemDefine(data,<ModelLogicDefine>item);
        } else if(item.type == LogicType.CALL_API) {
            return new LogicItemCallAPI(data,<ModelLogicDefine>item);
        }
        return null;
    }
}
