/**
 *
 * @author 
 *
 */
class ContentViewData extends egret.EventDispatcher {
    
	public constructor() {
        super();
	}
	
	public viewFile(file:FileInfo):void {
        var e: ContentViewEvent = new ContentViewEvent(ContentViewEvent.VIEW_FILE);
        e.file = file;
        this.dispatchEvent(e);
	}
	
    public closeFile(index: number): void {
        var e: ContentViewEvent = new ContentViewEvent(ContentViewEvent.CLOSE_FILE);
        e.index = index
        this.dispatchEvent(e);
    }

    public closeViewPanel(panel: ConentPanelItemBase): void {
        var e: ContentViewEvent = new ContentViewEvent(ContentViewEvent.CLOSE_PANEL);
        e.panel = panel
        this.dispatchEvent(e);
    }
}
