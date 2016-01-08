/**
 *
 * @author 
 *
 */
class PopManager extends eui.Component {
    
	public constructor() {
        super();
        PopManager.ist = this;
        this.width = Config.width;
        this.height = Config.height;
	}
	
    private masks = {};
	
    public pop(panel: egret.DisplayObject,center: boolean,mask: boolean,maskAlpha: number): void {
        if(mask) {
            var sp = new egret.Shape();
            sp.graphics.beginFill(0,maskAlpha);
            sp.graphics.drawRect(0,0,this.width,this.height);
            sp.graphics.endFill();
            this.addChild(sp);
            this.masks[panel.hashCode] = sp;
        }
        this.addChild(panel);
        if(mask) {
            panel.addEventListener(egret.Event.REMOVED,this.onViewRemove,this);
        }
        if(center) {
            panel.x = (this.width - panel.width) / 2;
            panel.y = (this.height - panel.height) / 2;
        }
	}
	
    private onViewRemove(e:egret.Event):void {
        if(e.target != e.currentTarget) return;
        e.currentTarget.removeEventListener(egret.Event.REMOVED,this.onViewRemove,this);
        e.currentTarget.parent.removeChild(e.currentTarget);
        if(this.masks[e.currentTarget.hashCode]) {
            this.masks[e.currentTarget.hashCode].parent.removeChild(this.masks[e.currentTarget.hashCode]);
            delete this.masks[e.currentTarget.hashCode];
        }
	}
	
    private static ist: PopManager;
	
    public static pop(panel: egret.DisplayObject,center:boolean=false,mask:boolean=false,maskAlpha:number=0.35) :void {
        PopManager.ist.pop(panel,center,mask,maskAlpha);
	}
}
