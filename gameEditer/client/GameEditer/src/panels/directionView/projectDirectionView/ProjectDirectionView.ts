/**
 *
 * @author 
 *
 */
class ProjectDirectionView extends DirectionView {
    
    public data:ProjectData;
    
	public constructor(direction:string) {
        super(ProjectDirectionItem);
        this.data = new ProjectData();
        new LoadingView(this.data);
        
        this.data.loadConfig(direction);
        this.dataProvider = this.data.direction;
	}
}
