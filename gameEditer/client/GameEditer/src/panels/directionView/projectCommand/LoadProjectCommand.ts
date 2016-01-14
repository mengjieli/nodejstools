/**
 *
 * @author 
 *
 */
class LoadProjectCommand extends egret.EventDispatcher {
    
    private project:ProjectData;
    
	public constructor(project:ProjectData,url:string) {
        super();
        this.project = project;
    	this.loadConfig(url);
	}
	
    public loadConfig(direction: string): void {
        this.project.path = direction;
        this.project.configURL = "editerProject.json";
        var localDirection = new DirectionData("");
        localDirection.flush();
        localDirection.addEventListener(egret.Event.COMPLETE,this.onInitFlushLocalDirection,this);
        new LoadingView(this);
        var e = new LoadingEvent(LoadingEvent.START);
        e.title = "加载项目配置";
        e.tip = "加载项目文件夹信息";
        this.dispatchEvent(e);
    }

    private onInitFlushLocalDirection(e: egret.Event): void {
        var localDirection: DirectionData = e.currentTarget;
        localDirection.removeEventListener(egret.Event.COMPLETE,this.onInitFlushLocalDirection,this);
        localDirection.dispose();
        var le = new LoadingEvent(LoadingEvent.PROGRESS);
        le.tip = "加载主配置文件";
        le.progress = 0.05;
        this.dispatchEvent(le);

        RES.getResByUrl(Config.getResourceURL(this.project.configURL),
            this.onLoadConfig,this,RES.ResourceItem.TYPE_JSON);
    }

    private onLoadConfig(config: any): void {
        
        var le = new LoadingEvent(LoadingEvent.PROGRESS);
        le.tip = "加载模块信息1";
        le.progress = 0.1;
        this.dispatchEvent(le);
        
        this.project.pathDesc = config.pathDesc;
        var paths = config.path;
        for(var i = 0;i < paths.length;i++) {
            this.project.addFloder(Path.getPath(paths[i]),Path.getName(paths[i]),this.project.getPathDesc(paths[i]));
        }
        var list = config.model;
        this.loadModelList = [];
        var file: FileInfo;
        for(var i = 0;i < list.length;i++) {
            file = this.project.addFile(Path.getPath(list[i]),Path.getName(list[i]),this.project.getPathDesc(list[i]),
                "model",new ModelInfo(Path.getPath(list[i]),Path.getName(list[i]),this.project.getPathDesc(list[i])));
            this.loadModelList.push(file);
        }
        list = config.data;
        for(var i = 0;i < list.length;i++) {
            file = this.project.addFile(Path.getPath(list[i]),Path.getName(list[i]),this.project.getPathDesc(list[i]),
                "data",new ModelInfo(Path.getPath(list[i]),Path.getName(list[i]),this.project.getPathDesc(list[i])));
        }
        this.loadModelIndex = 0;
        this.loadNextModel();
    }

    private loadModelIndex: number;
    private loadModelList: Array<FileInfo>;
    private loadNextModel(): void {
        var le = new LoadingEvent(LoadingEvent.PROGRESS);
        le.tip = "加载模块信息" + this.loadModelIndex + "/" + this.loadModelList.length;
        le.progress = 0.1 + 0.2 * (this.loadModelIndex/this.loadModelList.length);
        this.dispatchEvent(le);
        if(this.loadModelIndex < this.loadModelList.length) {
            var file = this.loadModelList[this.loadModelIndex];
            RES.getResByUrl(Config.getResourceURL(file.url),function(config) {
                var project: ProjectData = this.project;
                (new ProjectDirectionCommand(project)).updateFile(project.getData(file.url,LocalFileFormat.MODEL),
                    config,LocalFileFormat.MODEL,file.url);
                file.hasLoad = true;
                this.loadNextModel();
            },this,RES.ResourceItem.TYPE_JSON);
            this.loadModelIndex++;
        } else {
            //TODO 还有没做的
            this.dispatchEvent(new LoadingEvent(LoadingEvent.COMPLETE));
        }
    }
}
