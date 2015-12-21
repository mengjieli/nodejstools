/**
 *
 * @author 
 *
 */
class EditerData {
    
    public conteView: ContentViewData;
    public project: ProjectData;
    public ui: UIData;
    public menu: MenuData;
    
	public constructor() {
        
        this.conteView = new ContentViewData();
        
        this.ui = new UIData();
        this.menu = new MenuData();
	}
	
    public static ist: EditerData;
    
    public static getInstance(): EditerData {
        if(!EditerData.ist) {
            EditerData.ist = new EditerData();
        }
        return EditerData.ist;
    }
}
