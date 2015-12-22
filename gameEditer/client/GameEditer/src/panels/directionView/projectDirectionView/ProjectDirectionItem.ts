/**
 *
 * @author 
 *
 */
class ProjectDirectionItem extends DirectionViewItem{

    private addFloderBtn: ImageButton;
    private addFileBtn: ImageButton;
    private freshBtn: ImageButton;
    private deleteBtn: ImageButton;
    
	public constructor() {
        super();

        this.addFloderBtn = new ImageButton(RES.getRes("addFloder"),this.addFloder,this);
        this.addChild(this.addFloderBtn);
        this.addFloderBtn.right = 86;
        this.addFloderBtn.y = 5;

        this.addFileBtn = new ImageButton(RES.getRes("addFile"),this.addFile,this);
        this.addChild(this.addFileBtn);
        this.addFileBtn.right = 59;
        this.addFileBtn.y = 5;
        
        this.freshBtn = new ImageButton(RES.getRes("refresh"));
        this.addChild(this.freshBtn);
        this.freshBtn.right = 32;
        this.freshBtn.y = 5;

        this.deleteBtn = new ImageButton(RES.getRes("delete"));
        this.addChild(this.deleteBtn);
        this.deleteBtn.right = 5;
        this.deleteBtn.y = 5;
        
        this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClick,this);
    }
    
    protected setData(val: any) {
        super.setData.call(this,val);
        if(this.data) {
            this.changeStatusWidthButtons();
        }
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
        this.changeStatusWidthButtons();
    }
    
    protected changeStatusWidthButtons():void {
        if(this.data == null || this.selected == false) {
            this.addFloderBtn.visible = this.addFileBtn.visible =
            this.freshBtn.visible = this.deleteBtn.visible = false;
        } else {
            var names = ["addFloder","addFile","fresh","delete"];
            var flags = [true,true,true,true];
            names.reverse();
            flags.reverse();
            var parent = this.data;
            var more2 = parent.more2;
            while(!more2) {
                parent = parent.parent;
                more2 = parent.more2;
            }
            for(var i = 0;i < names.length; i++) {
                flags[i] = more2[names[i]];
            }
            if(this.data.more2) {
                flags[0] = false;
            }
            var index = 0;
            for(i = 0;i < names.length;i++) {
                var btn = this[names[i] + "Btn"];
                btn.visible = flags[i];
                if(flags[i]) {
                    btn.right = 5 + index * 27;
                    index++;
                }
            }
        }
    }
    
    private addFloder():void {
        PopManager.pop(new AddProjectDirectionPanel(this.data.more,this.data),true,true);
    }

    private addFile(): void {
        PopManager.pop(new AddProjectFilePanel(this.data.more,this.data),true,true);
    }
}
