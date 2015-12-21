/**
 *
 * @author 
 *
 */
class Menu extends eui.Component {
    
	public constructor() {
        super();
        
        this.width = Config.width;
        this.height = 30;
        
        var image: eui.Image = new eui.Image();
        image.source = "resource/images/blue2.png";
        this.addChild(image);
        image.percentWidth = 100;
        image.percentHeight = 100;
        
        var btn: ImageButton;
        btn = new ImageButton(RES.getRes("save"),this.clickSave,this);
        this.addChild(btn);
        btn.x = 5;
        btn.y = 5;
	}
	
    private clickSave():void {
        EditerData.getInstance().menu.click(MenuData.SAVE);
    }
	
    private showWorkDirection(e:egret.TouchEvent):void {
    }
    
    private showSelectFileView(e: egret.TouchEvent): void {
        PopManager.pop(new FileSelecteView(Config.workFile),true);
    }
}
