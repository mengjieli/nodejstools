/**
 *
 * @author 
 *
 */
class ModelAddLogicPanel extends eui.Panel {
    
    private sure: eui.Button;
    private cancle: eui.Button;
    private data: ModelInfo;
    private logic: ModelLogicInfo;
    private paramContainer: egret.Sprite;
    
    public constructor(data:ModelInfo,logic:ModelLogicInfo=null) {
        super();

        var newLogic = false;
        if(logic) {
            this.title = "修改模块逻辑";
        } else {
            newLogic = true;
            this.title = "添加模块逻辑";
        }
        
        this.data = data;
        this.logic = logic;
        if(this.logic == null) {
            this.logic = new ModelLogicInfo("","");
        }

        this.width = 600;
        this.height = 500;
        
        var label:eui.Label;
        label = new eui.Label();
        label.size = 14;
        label.textColor = 0;
        label.text = "参数: ";
        label.x = 20;
        label.y = 110;
        this.addChild(label);
        
        this.addTitle();

        this.paramContainer = new egret.Sprite();
        this.addChild(this.paramContainer);

        var button;
        button = new eui.Button();
        button.width = 70;
        button.height = 30;
        button.label = "确定";
        this.addChild(button);
        button.bottom = 5;
        this.sure = button;
        this.sure.addEventListener(egret.TouchEvent.TOUCH_TAP,function(e: egret.TouchEvent): void {
            if(newLogic) {
                this.logic.name = input.text;
                this.logic.desc = input2.text;
                data.addLogic(this.logic);
            }
            this.parent.removeChild(this);
        },this);

        button = new eui.Button();
        button.width = 70;
        button.height = 30;
        button.label = "取消";
        this.addChild(button);
        button.bottom = 5;
        this.cancle = button;
        this.cancle.addEventListener(egret.TouchEvent.TOUCH_TAP,function(e: egret.TouchEvent): void {
            this.parent.removeChild(this);
        },this);

        this.sure.horizontalCenter = -60;
        this.cancle.horizontalCenter = 60;

        label = new eui.Label();
        label.size = 14;
        label.textColor = 0;
        label.text = "名称: ";
        label.x = 20;
        label.y = 50;
        this.addChild(label);

        var input = new eui.Label();
        input.size = 14;
        input.border = true;
        input.borderColor = 0;
        input.textColor = 0;
        input.type = egret.TextFieldType.INPUT;
        input.restrict = "a-z A-Z 0-9"
        input.x = 60;
        input.y = 50;
        input.width = 210;
        input.height = 20;
        input.textAlign = egret.VerticalAlign.MIDDLE;
        this.addChild(input);

        label = new eui.Label();
        label.size = 14;
        label.textColor = 0;
        label.text = "备注: ";
        label.x = 20;
        label.y = 75;
        this.addChild(label);

        var input2 = new eui.Label();
        input2.size = 14;
        input2.border = true;
        input2.borderColor = 0;
        input2.textColor = 0;
        input2.maxChars = 10;
        input2.type = egret.TextFieldType.INPUT;
        input2.x = 60;
        input2.y = 75;
        input2.width = 210;
        input2.height = 20;
        input2.textAlign = egret.VerticalAlign.MIDDLE;
        this.addChild(input2);
        
        this.flush();
	}
	
	private addTitle():void {
        var startX = 60;
        var startY = 110;
        var label = new eui.Label();
        label.x += startX;
        label.y += startY;
        label.textColor = 0;
        label.size = 14;
        label.text = "参数描述";
        this.addChild(label);

        label = new eui.Label();
        label.textColor = 0;
        label.size = 14;
        label.text = "类型";
        label.x = 100;
        label.x += startX;
        label.y += startY;
        this.addChild(label);

        label = new eui.Label();
        label.textColor = 0;
        label.size = 14;
        label.text = "初始值";
        label.x = 200;
        label.x += startX;
        label.y += startY;
        this.addChild(label);
	}
	
    private addParamSprite(index: number): void {
        var paramAddSp = new egret.Sprite();
        this.paramContainer.addChild(paramAddSp);
        paramAddSp.x = 60;
        var param: ParamInfo;
        if(index >= 0) {
            paramAddSp.y = 135 + index*60;
            param = this.logic.getParamAt(index);
        } else {
            paramAddSp.y = 135 + this.logic.paramCount*60;
            param = new ParamInfo();
        }

        var newDesc: eui.Label = new eui.Label();
        paramAddSp.addChild(newDesc);
        newDesc.type = egret.TextFieldType.INPUT;
        newDesc.border = true;
        newDesc.textAlign = egret.VerticalAlign.MIDDLE;
        newDesc.backgroundColor = 0;
        newDesc.textColor = 0;
        newDesc.size = 14;
        newDesc.width = 80;
        newDesc.height = 20;
        newDesc.maxChars = 5;
        newDesc.y = 0;
        var sureAddButton = new eui.Button();
        sureAddButton.width = 50;
        sureAddButton.height = 30;
        if(index >= 0) {
            newDesc.text = param.desc;
        } else {
            param.desc = newDesc.text;
        }

        var typeDrop = new DropDownList(80,120);
        typeDrop.x = 100;
        typeDrop.y = 0;
        var typeData = DataConfig.typeDropDownData;
        typeDrop.dataProvider = typeData;
        typeDrop.addEventListener(egret.Event.CHANGE,function(e: egret.Event): void {
            if(typeDrop.selectedItem.type == "Array") {
                typeDrop2.visible = true;
            } else {
                typeDrop2.visible = false;
            }
        },null);

        var typeDrop2 = new DropDownList(80,100);
        typeDrop2.x = 100;
        typeDrop2.y = 25;
        var typeData = DataConfig.typeArrayDropDownData;
        typeDrop2.dataProvider = typeData;
        paramAddSp.addChild(typeDrop2);
        typeDrop2.visible = false;
        

        if(index >= 0) {
            for(var i = 0;i < typeDrop.dataProvider.length; i++) {
                if(typeDrop.dataProvider.getItemAt(i).type == param.type.type) {
                    typeDrop.selectIndex = i;
                    break;
                }
            }
            if(typeDrop.selectedItem.type == "Array") {
                typeDrop2.visible = true;
                for(var i = 0;i < typeDrop2.dataProvider.length;i++) {
                    if(typeDrop2.dataProvider.getItemAt(i).type == param.type.typeValue) {
                        typeDrop2.selectIndex = i;
                        break;
                    }
                }
            }
        } else {
            param.type = new TypeInfo(typeDrop.selectedItem.type,typeDrop2.visible ? typeDrop2.selectedItem.type : null);
        }

        paramAddSp.addChild(typeDrop);

        var initDrop = new DropDownList(80,60);
        initDrop.x = 200;
        initDrop.y = 0;
        var typeData = new eui.ArrayCollection();
        typeData.addItem({ label: "无初始值",type: false });
        typeData.addItem({ label: "有初始值",type: true });
        initDrop.dataProvider = typeData;
        initDrop.addEventListener(egret.Event.CHANGE,function(e: egret.Event): void {
            if(initDrop.selectedItem.type == true) {
                initTxt.visible = true;
                initTxt.text = "NULL";
            } else {
                initTxt.visible = false;
            }
        },null);

        var initTxt = new eui.Label();
        initTxt.width = 80;
        initTxt.height = 20;
        initTxt.type = egret.TextFieldType.INPUT;
        initTxt.size = 14;
        initTxt.border = true;
        initTxt.borderColor = 0;
        initTxt.textColor = 0;
        initTxt.x = 200;
        initTxt.y = 25;
        initTxt.visible = false;
        paramAddSp.addChild(initTxt);

        paramAddSp.addChild(initDrop);

        if(index >= 0) {
            if(param.init) {
                initDrop.selectIndex = 1;
                initTxt.visible = true;
                initTxt.text = param.init;
            } else {
                initTxt.text = "null";
            }
        } else {
            param.init = null;
        }
        
        if(index < 0) {
            var addParamBtn = new eui.Button();
            addParamBtn.label = "添加";
            addParamBtn.x = 300;
            addParamBtn.y = 10;
            addParamBtn.width = 50;
            addParamBtn.height = 30;
            paramAddSp.addChild(addParamBtn);
            addParamBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,function(e: egret.TouchEvent): void {
                if(newDesc.text == "") {
                    new AlertPanel("请输入参数描述");
                    return;
                }
                param.desc = newDesc.text;
                param.type = new TypeInfo(typeDrop.selectedItem.type,typeDrop2.visible ? typeDrop2.selectedItem.type : null);
                param.init = initTxt.visible ? initTxt.text : null;
                this.logic.addParam(param);
                this.flush();
            },this);
        } else {
            
        }
    }
    
    private flush(): void {
        while(this.paramContainer.numChildren) {
            this.paramContainer.removeChildAt(0);
        }
        this.addParamSprite(-1);
        for(var i = this.logic.paramCount - 1;i >= 0; i--) {
            this.addParamSprite(i);
        }
    }
}
