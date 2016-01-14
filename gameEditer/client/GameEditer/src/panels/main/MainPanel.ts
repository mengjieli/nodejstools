/**
 *
 * @author 
 *
 */
class MainPanel extends eui.Component{
    
	public constructor() {
        super();
	}
	
    public start(): void {
        EditerData.getInstance();
        this.addChild(new Menu());
        this.addChild(new ProjectView());
        
//        PopManager.pop(new ModelAddLogicPanel(null));
	}
	
    private onSaveToServer(e:egret.TouchEvent):void {
        var file = new LocalFile("a.json");
        file.addEventListener(egret.Event.COMPLETE,this.onPostComplete,this);
        file.saveFile("{\"name\":\"Upload123\"}");
    }
    
    private onPostComplete(e:egret.Event):void {
        console.log("保存完毕");
//        EditerData.getInstance().workDirection.flush();
    }
}
