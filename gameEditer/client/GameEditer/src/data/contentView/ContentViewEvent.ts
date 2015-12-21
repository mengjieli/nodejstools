/**
 *
 * @author 
 *
 */
class ContentViewEvent extends egret.Event{
    
    public static VIEW_FILE = "view_file";
    public static CLOSE_FILE = "close_file";
    public static CLOSE_PANEL = "close_panel";
    
    public file: FileInfo;
    public index: number;
    public panel: ConentPanelItemBase;
    
	public constructor(type:string) {
    	super(type)
	}
}
