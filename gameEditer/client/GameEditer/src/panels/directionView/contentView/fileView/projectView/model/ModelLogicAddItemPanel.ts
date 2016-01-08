/**
 *
 * @author 
 *
 */
class ModelLogicAddItemPanel extends AlertPanel {
    
    private data:ModelLogicInfo;
    private sureBack:Function;
    private type:string;
    private parentLogic:ModelLogicItemInfo;
    
	public constructor(type:string,name:string,data:ModelLogicInfo,parentLogic:ModelLogicItemInfo) {
    	super("",name,"确定",this.clickSure,this,"取消");
    	
    	this.type = type;
    	this.data = data;
        this.parentLogic = parentLogic;
    	
    	if(type == "define") {
            this.define();
    	}
	}
	
	private define():void {
	    
    	this.width = 400;
    	this.height = 300;
    	
    	var cp:any = new eui.Component();
    	this.addChild(cp);
        var exml =
            `<e:Skin xmlns:e="http://ns.egret.com/eui">
                <e:Label x="20" y="50" text="名称" size="14" textColor="0"/>
                <e:Label id="nameTxt" x="70" y="50" size="14" textColor="0" border="true" borderColor="0" width="150" height="20" type="input" restrict="a-z A-Z 0-9"/>
                <e:Label x="20" y="80" text="描述" size="14" textColor="0"/>
                <e:Label id="descTxt" x="70" y="80" size="14" textColor="0" border="true" borderColor="0" width="150" height="20" type="input"/>
                <e:Label x="20" y="110" text="类型" size="14" textColor="0"/>
                <e:Label x="20" y="140" text="初始值" size="14" textColor="0"/>
                <e:Label id="initTxt" x="200" y="140" size="14" textColor="0" border="true" borderColor="0" width="150" height="20" type="input"/>
            </e:Skin>`;
        cp.skinName = exml;

        var initType = new DropDownList(100,60);
        initType.dataProvider = new eui.ArrayCollection([{ "label": "无初始值","value": false },{ "label": "有初始值","value": true }]);
        this.addChild(initType);
        initType.x = 70;
        initType.y = 140;
        cp.initTxt.visible = false;
        initType.addEventListener(egret.Event.CHANGE,function(e: egret.Event): void {
            cp.initTxt.visible = initType.selectedItem.value;
        },null);
        
      var type = new DropDownList(120,200);
      type.dataProvider = DataConfig.typeDropDownData;
      this.addChild(type);
      type.x = 70;
      type.y = 110;
      type.addEventListener(egret.Event.CHANGE,function(e: egret.Event): void {
            if(type.selectedItem.type == "Array") {
                typeValue.visible = true;
            } else {
                typeValue.visible = false;
            }
        },null);
      
      var typeValue = new DropDownList(120,200);
      typeValue.dataProvider = DataConfig.typeArrayDropDownData;
      this.addChild(typeValue);
      typeValue.x = 210;
      typeValue.y = 110;
      typeValue.visible = false;
      var data = this.data;
      var parentLogic = this.parentLogic;
      this.sureBack = function(){
          var logic: ModelLogicDefine = <ModelLogicDefine>data.getNewLogic(this.type);
          logic.name = cp.nameTxt.text;
          logic.desc = cp.descTxt.text;
          logic.varType = new TypeInfo(type.selectedItem.type,typeValue.visible?typeValue.selectedItem.type:null);
          logic.init = cp.initTxt.visible?cp.initTxt.text:null;
          if(parentLogic) {
              parentLogic.next = logic.id;
          }
          data.addLogic(logic);
      };
	}
	
	private clickSure():void {
	    if(this.sureBack) {
	        this.sureBack.call(this);
	    }
	}
}
