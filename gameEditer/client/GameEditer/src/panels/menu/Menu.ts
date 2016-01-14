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
        
        var image = new WinBgImage();
        this.addChild(image);
        image.percentWidth = 100;
        image.percentHeight = 100;
        
        var btn: ImageButton;
        btn = new ImageButton(RES.getRes("save"),this.clickSave,this);
        this.addChild(btn);
        btn.x = 10;
        btn.y = 8;
	}
	
    private clickSave():void {
        EditerData.getInstance().menu.click(MenuData.SAVE);
    }
	
    private showWorkDirection(e:egret.TouchEvent):void {
    }
    
    private showSelectFileView(e: egret.TouchEvent): void {
        PopManager.pop(new FileSelecteView(""),true);
    }
}
