/**
 *
 * @author 
 *
 */
class ProjectData extends egret.EventDispatcher {
    /**
     * 项目名称
     */ 
    private name: string = "";
    /**
     * 项目目录
     */ 
    private path: string;
    /**
     * 配置文件目录
     */ 
    public configURL: string;
    /**
     * 模块列表
     */ 
    private models: Array<ModelInfo> = [];
    /**
     * 模块列表
     */
    private views: Array<ViewInfo> = [];
    /**
     * 数据列表
     */
    private datas: Array<DataInfo> = [];
    
    /**
     * 整理之后的目录结构
     */ 
    public direction: eui.ArrayCollection;
    /**
     * 电脑上的目录信息
     */
    private localDirection: DirectionData;
    
    private pathDesc: Object = {};
    
	public constructor() {
        super();
        this.direction = new eui.ArrayCollection();
        var list = ProjectDirectionData.data;
        for(var i = 0;i < list.length; i++) {
            var name = list[i].name;
            var direction = this[name + "Direction"] = 
                new FileInfo(list[i].src,list[i].desc,null,null,LocalFileType.DIRECTION,"close",list[i].depth); 
            direction.dataList = this.direction;
            direction.more = this;
            if(list[i].parent) {
                direction.parent = this[list[i].parent + "Direction"];
            }
            this.direction.addItem(direction);
        }
    } 
	
    public loadConfig(direction: string): void {
        this.path = direction;
        this.configURL = "editerProject.json";
        this.localDirection = new DirectionData(this.path);
        this.localDirection.flush();
        this.localDirection.addEventListener(egret.Event.COMPLETE,this.onInitFlushLocalDirection,this);
        var e = new LoadingEvent(LoadingEvent.START);
        e.title = "加载项目配置";
        e.tip = "加载项目文件夹信息";
        this.dispatchEvent(e);
    }
    
    private onInitFlushLocalDirection(e: egret.Event): void {
        this.localDirection.removeEventListener(egret.Event.COMPLETE,this.onInitFlushLocalDirection,this);
        var le = new LoadingEvent(LoadingEvent.PROGRESS);
        le.tip = "加载主配置文件";
        le.progress = 0.05;
        this.dispatchEvent(le);

        RES.getResByUrl(Config.localResourceServer + "/" + this.configURL,this.onLoadConfig,this);
    }
    
    private onLoadConfig(data:string):void {
        var le = new LoadingEvent(LoadingEvent.PROGRESS);
        le.tip = "加载模块信息";
        le.progress = 0.1;
        this.dispatchEvent(le);
        //TODO 还有没做的
        this.dispatchEvent(new LoadingEvent(LoadingEvent.COMPLETE));
    }
    
    private getDirection(key:string,val):FileInfo {
        for(var i = 0;i < this.direction.length; i++) {
            var item = this.direction.getItemAt(i);
            if(item[key] == val) {
                return item;
            }
        }
        return null;
    }

    private getDirectionNewIndex(url:string): number {
        var max = 0;
        for(var i = 0;i < this.direction.length;i++) {
            var item = this.direction.getItemAt(i);
            if(item.url == url || item.url.slice(0,url.length) && item.url.charAt(url.length) == "/") {
                max = i + 1; 
            }
        }
        return max;
    }
    
    public addFloder(url:string,name:string,desc:string,complete:Function=null,thisObj:any=null):void {
        var file = new LocalFile(Config.workFile +  url + "/" + name + "/");
        file.addEventListener(egret.Event.COMPLETE,function(e:egret.Event):void{
            file.dispose();
            var dirName = name;
            if(desc != "") {
                this.pathDesc[url + "/" + name] = desc;
                dirName = desc;
            }
            var floder = new FileInfo(url + "/" + name,dirName,null,null,LocalFileType.DIRECTION,"close",url.split("/").length);
            floder.parent = this.getDirection("url",url);
            floder.dataList = this.direction;
            floder.more = this;
            this.direction.addItemAt(floder,this.getDirectionNewIndex(url));
            if(complete) {
                complete.call(thisObj);
            }
        },this);
        file.makeDirection();
    }

    public encodeConfig(): Object {
        return {};
    }
    
    public decodeConfig(val:Object):void {
        
    }
}
