/**
 *
 * @author 
 *
 */
class FileSelecteView extends eui.Panel {
    
    private directionView: DirectionView;
    private directionData: DirectionData;
    
    
    public constructor(path:string) {
        super();
        
        this.title = "选择文件";
        this.width = 400;
        this.height = 600;
        
        this.directionData = new DirectionData(path);
        
        this.addChild(this.directionView = new DirectionView());
        this.directionView.y = 30;
        this.directionView.percentWidth = 100;
        this.directionView.dataProvider = this.directionData.data;
        
        var btn = new eui.Button();
        this.addChild(btn);
        btn.bottom = 0;
        btn.right = 0;
        btn.height = 30;
        btn.label = "确定";
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickSure,this);
        
        this.directionData.flush();
	}
	
    public validateDisplayList():void {
        super.validateDisplayList();
        this.directionView.height = this.height - this.directionView.y - 30;
    }
    
    private onClickSure(e:egret.TouchEvent):void {
        var file: FileInfo = this.directionView.selectedItem;
        
        new AlertPanel("当前选择的文件：\n" + file.url,"标题啊","嗯？",null,null,"哦！");
    }
}
