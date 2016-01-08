/**
 *
 * @author 
 *
 */
class ModelView extends ConentPanelItemBase {
    
    private file: FileInfo;
    private data: ModelInfo;
    private logicListBg: WinBgImage;
    private logicList: eui.List;
    private addLogicBtn: ImageButton;
    private viewListTitle: eui.Label;
    private viewListBg: WinBgImage;
    private editer: ModelEditer;
    
    public constructor(file: FileInfo) {
        super();
        this.initUI();
        this.file = file;
        if(this.file.hasLoad == false) {
            RES.getResByUrl(Config.getResourceURL(file.url),function(config) {
                var project:ProjectData = this.file.more;
                (new ProjectDirectionCommand(project)).updateFile(project.getData(file.url,LocalFileFormat.MODEL),
                    config,LocalFileFormat.MODEL,file.url);
                this.file.hasLoad = true;
                this.dataReady();
            },this,RES.ResourceItem.TYPE_JSON);
        } else {
            this.dataReady();
        }
	}
	
    public validateDisplayList():void {
        super.validateDisplayList();
        this.logicList.height = (this.height - 25) * 0.67;
        this.logicListBg.height = (this.height - 25) * 0.67 + 25;
        this.viewListBg.y = (this.height - 25) * 0.67 + 20;
        this.viewListBg.height = this.height - this.viewListBg.y - 25;
        this.viewListTitle.y = (this.height - 25) * 0.67 + 25;
        this.editer.width = this.width - 160;
    }
	
    private initUI(): void {
        this.percentWidth = 100;
        this.percentHeight = 100;
        
        this.logicListBg = new WinBgImage(2);
        this.addChild(this.logicListBg);
    	
        this.logicList = new eui.List();
        this.logicList.itemRenderer = ModelLogicItem;
        this.logicList.x = 5;
        this.logicList.y = 30;
        this.logicList.width = 200;
        this.addChild(this.logicList);
        this.logicList.addEventListener("selected",this.onSelectItem,this);
        
        this.addLogicBtn = new ImageButton(RES.getRes("addFloder"));
        this.addLogicBtn.x = 190;
        this.addLogicBtn.y = 5;
        this.addLogicBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.addLogic,this);
        this.addChild(this.addLogicBtn);
        
        this.logicListBg.width = 210;

        this.viewListBg = new WinBgImage(2);
        this.addChild(this.viewListBg);
        this.viewListBg.width = 210;

        var label: eui.Label = new eui.Label();
        label.size = 14;
        label.text = "模块逻辑、接口";
        label.textColor = 0xaaaaaa;
        this.addChild(label);
        label.y = 5;
        label.x = 5;
        
        label = new eui.Label();
        label.size = 14;
        label.text = "模块视图";
        label.textColor = 0xaaaaaa;
        this.addChild(label);
        label.y = 2;
        label.x = 5;
        this.viewListTitle = label;
        
        this.editer = new ModelEditer();
        this.editer.percentHeight = 100;
        this.editer.x = 209;
        this.addChild(this.editer);
	}
	
	private addLogic(e:egret.TouchEvent):void {
        PopManager.pop(new ModelAddLogicPanel(this.data),true,true);
	}
	
    private onSelectItem(e:egret.Event):void {
        this.editer.showLogic(this.logicList.selectedItem);
    }
	
    private dataReady():void {
        this.data = this.file.data;
        this.data.addEventListener(egret.Event.CHANGE,this.onChangeData,this);
        this.logicList.dataProvider = this.data.logics;
        if(this.logicList.dataProvider.length) {
            this.logicList.selectedIndex = 0;
        }
	}
	
    private onChangeData():void {
    }

    public isExist(e: ContentViewEvent): boolean {
        if(e.file == this.file) {
            return true;
        }
        return false;
    }

    public get name(): string {
        if(this.data) {
            return this.file.name + "    " + (this.data.isNew==false?"*":"") + "    ";
        }
        return this.file.name + "        ";
    }
}
