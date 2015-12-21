/**
 *
 * @author 
 *
 */
class UIData extends egret.EventDispatcher {
    
	public constructor() {
        super();
	}
	
	public showPanel(panelName:string) {
        this.dispatchEvent(new UIDataEvent(UIDataEvent.SHOW_PANEL,panelName));
	}
}


