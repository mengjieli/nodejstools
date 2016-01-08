/**
 *
 * @author 
 *
 */
class SaveProjectCommand {
    
    private saveIndex:number = 0;
    private saveList: Array<FileInfoBase>;
    private dispatcher: egret.EventDispatcher;
    
	public constructor(data:ProjectData) {
    	
        this.saveList = data.getFileSaveList();

        var dispatcher = new egret.EventDispatcher();
        this.dispatcher = dispatcher;
        new LoadingView(dispatcher);
        var loadingEvent = new LoadingEvent(LoadingEvent.START);
        loadingEvent.title = "保存项目中";
        dispatcher.dispatchEvent(loadingEvent);

        loadingEvent = new LoadingEvent(LoadingEvent.PROGRESS);
        loadingEvent.progress = 0;
        dispatcher.dispatchEvent(loadingEvent);
        
        console.log("save project:",Config.workFile + "/" + data.configURL);
        var file = new LocalFile(Config.workFile + "/" + data.configURL);
        file.saveFile(JSON.stringify(data.encodeConfig()));
        file.addEventListener(egret.Event.COMPLETE,function(e: egret.Event) {
            file.dispose();
            loadingEvent = new LoadingEvent(LoadingEvent.PROGRESS);
            loadingEvent.progress = 1 / (1 + this.saveList.length);
            dispatcher.dispatchEvent(loadingEvent);
            this.saveNextFile();
        },this);
	}
	
	public saveNextFile():void {
	    if(this.saveIndex >= this.saveList.length) {
            this.dispatcher.dispatchEvent(new LoadingEvent(LoadingEvent.COMPLETE));
            PopManager.pop(new ScrollTip("保存成功"));
            return;
	    }
        var data = this.saveList[this.saveIndex];
        var file = new LocalFile(Config.workFile + "/" + data.url);
        file.saveFile(data.fileContent);
        file.addEventListener(egret.Event.COMPLETE,function(e: egret.Event) {
            file.dispose();
            this.saveIndex++;
            var loadingEvent = new LoadingEvent(LoadingEvent.PROGRESS);
            loadingEvent.progress = (1 + this.saveIndex) / (1 + this.saveList.length);
            this.dispatcher.dispatchEvent(loadingEvent);
            this.saveNextFile();
        },this);
	}
}
