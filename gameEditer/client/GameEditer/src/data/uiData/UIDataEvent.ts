/**
 *
 * @author 
 *
 */
class UIDataEvent extends egret.Event {

    public static SHOW_PANEL: string = "show_panel";
    
    public name: string;
    
	public constructor(type,name) {
        super(type);
        this.name = name;
	}
}
