/**
 *
 * @author 
 *
 */
class ProjectView extends eui.Component {
    
    private directionView: ProjectDirectionView;
    private contentPanel: ContentPanel;
    
	public constructor() {
        super();
        this.y = 30;
        this.width = Config.width;
        this.height = Config.height - this.y;
        this.addChild(this.directionView = new ProjectDirectionView(Config.workFile));
        this.directionView.width = 300;
        this.directionView.percentHeight = 100;
        
        this.contentPanel = new ContentPanel();
        this.contentPanel.x = 298;
        this.contentPanel.width = this.width - this.contentPanel.x;
        this.contentPanel.percentHeight = 100;
        this.addChild(this.contentPanel);
        
        EditerData.getInstance().menu.addEventListener(MenuEvent.CLICK,this.onClickMenu,this);
	}
	
	private onClickMenu(e:MenuEvent):void {
	    if(e.menu == MenuData.SAVE) {
            new SaveProjectCommand(this.directionView.data);
	    }
	}
}
