/**
 *
 * @author 
 *
 */
class MenuEvent extends egret.Event{
    
    public static CLICK: string = "click";
    
    public menu: string = "";
    
	public constructor(type:string,menu:string) {
        super(type);
        this.menu = menu;
	}
}
