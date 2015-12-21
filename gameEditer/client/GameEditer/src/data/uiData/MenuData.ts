/**
 *
 * @author 
 *
 */
class MenuData extends egret.EventDispatcher {
    
    public static SAVE: string = "save";
    
	public constructor() {
        super();
	}
	
	public click(menu:string):void {
        this.dispatchEvent(new MenuEvent(MenuEvent.CLICK,menu));
	}
}
