/**
 *
 * @author 
 *
 */
class ModelLogicTypeListPanel extends eui.Component {
    
    private list:List;
    private data:ModelLogicInfo;
    private parentLogic:ModelLogicItemInfo;
    
	public constructor(x,y,info:ModelLogicInfo,parentLogic:ModelLogicItemInfo=null) {
    	super();
    	this.data = info;
        this.parentLogic = parentLogic;
    	this.x = x + 20;
    	this.y = y;
    	var list = new List();
    	this.list = list;
    	list.width = 150;
    	list.height = 80;
    	var data = new eui.ArrayCollection();
    	data.addItem({"label":"定义变量","type":"define"});
    	data.addItem({"label":"条件判断","type":"if"});
    	data.addItem({"label":"调用 model API","type":"callAPI"});
        data.addItem({ "label": "返回值","type": "return" });
    	list.dataProvider = data;
    	list.addEventListener(egret.Event.CHANGE,this.onListChange,this);
    	this.addChild(list);
    	this.addEventListener(egret.Event.ADDED_TO_STAGE,this.addToStage,this);
	}
	
	private addToStage(e:egret.Event):void {
    	this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouch,this);
	}
	
    private onTouch(e: egret.TouchEvent): void {
        var target = e.target;
        var self = false;
        while(target) {
            if(target == this) {
                self = true;
                break;
            }
            target = target.parent;
        }
        if(!self) {
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouch,this);
            this.parent.removeChild(this);
        }
    }
    
    private onListChange(e:egret.Event): void {
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouch,this);
        this.list.removeEventListener(egret.Event.CHANGE,this.onListChange,this);
        var _this = this;
        var item = this.list.selectedItem;
        setTimeout(function() {
            _this.parent.removeChild(_this);
            new ModelLogicAddItemPanel(item.type,item.label,_this.data,_this.parentLogic);
        },150);
    }
}
