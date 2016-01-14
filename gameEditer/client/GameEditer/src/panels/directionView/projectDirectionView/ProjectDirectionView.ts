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
        this.dataProvider = this.data.direction;
        (new LoadProjectCommand(this.data,direction)).addEventListener(LoadingEvent.COMPLETE,function(){
            var file = this.data.getFile("model/main.json");
            if(file) {
                EditerData.getInstance().conteView.viewFile(file);
            }
        },this);
	}
}
