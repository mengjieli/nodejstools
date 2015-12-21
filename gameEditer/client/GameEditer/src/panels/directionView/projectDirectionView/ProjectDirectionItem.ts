/**
 *
 * @author 
 *
 */
class ProjectDirectionItem extends DirectionViewItem{

    private addFloderBtn: ImageButton;
    private addFileBtn: ImageButton;
    private freshBtn: ImageButton;
    private deleteFileBtn: ImageButton;
    
	public constructor() {
        super();

        this.addFloderBtn = new ImageButton(RES.getRes("addFloder"),this.addFloder,this);
        this.addChild(this.addFloderBtn);
        this.addFloderBtn.right = 86;
        this.addFloderBtn.y = 5;

        this.addFileBtn = new ImageButton(RES.getRes("addFile"));
        this.addChild(this.addFileBtn);
        this.addFileBtn.right = 59;
        this.addFileBtn.y = 5;
        
        this.freshBtn = new ImageButton(RES.getRes("refresh"));
        this.addChild(this.freshBtn);
        this.freshBtn.right = 32;
        this.freshBtn.y = 5;

        this.deleteFileBtn = new ImageButton(RES.getRes("delete"));
        this.addChild(this.deleteFileBtn);
        this.deleteFileBtn.right = 5;
        this.deleteFileBtn.y = 5;
        
        this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClick,this);
    }

    private lastClickTime: number = 0;
    private onClick(e: egret.TouchEvent): void {
        var now = (new Date()).getTime();
        if(now - this.lastClickTime < 1000) {
            if(this.data.type == LocalFileType.FILE) {
                //EditerData.getInstance().conteView.viewFile(this.data);
            }
        }
        this.lastClickTime = now;
    }

    protected setSelected(val: boolean): void {
        super.setSelected.call(this,val);
        
        this.addFloderBtn.visible = this.addFileBtn.visible = this.freshBtn.visible = this.deleteFileBtn.visible = val;
    }
    
    private addFloder():void {
        PopManager.pop(new AddProjectDirectionPanel(this.data.more,this.data.url),true,true);
    }
}
