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
    public path: string;
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
     * 动画
     */ 
    private animations: Array<AniamationInfo> = [];
    /**
     * SpritesSheet
     */ 
    private spritesSheets: Array<SpritesSheetInfo> = [];
    /**
     * 图片
     */ 
    private images: Array<ImageInfo> = [];
    
    /**
     * 整理之后的目录结构
     */ 
    public direction: eui.ArrayCollection;
    /**
     * 电脑上的目录信息
     */
//    private localDirection: DirectionData;
    
    public pathDesc: Object = {};
    
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
            direction.more2 = list[i]["more2" + ""];
            direction.virtual = true;
            if(list[i].parent) {
                direction.parent = this[list[i].parent + "Direction"];
            }
            this.direction.addItem(direction);
        }
    } 
    
    public hasPath(url:string):boolean {
        for(var i = 0;i < this.direction.length;i++) {
            var item = this.direction.getItemAt(i);
            if(item.url == url) {
                return true;
            }
        }
        return false;
    }
    
    public getFile(url: string): FileInfo {
        for(var i = 0;i < this.direction.length;i++) {
            var item = this.direction.getItemAt(i);
            if(item.url == url) {
                return item;
            }
        }
        return null;
    }
    
    public getFileInPath(url: string): Array<FileInfo> {
        var list: Array<FileInfo> = [];
        for(var i = 0;i < this.direction.length;i++) {
            var item = this.direction.getItemAt(i);
            if(item.url.slice(0,url.length) == url && item.url.charAt(url.length) == "/") {
                list.push(item);
            }
        }
        return list;
    }
    
    public getLocalFile(url: string): LocalFile {
        for(var i = 0;i < this.direction.length;i++) {
            var item = this.direction.getItemAt(i);
            if(item.url == url) {
                return item;
            }
        }
        return null;
    }
    
    public getDirection(key:string,val):FileInfo {
        for(var i = 0;i < this.direction.length; i++) {
            var item = this.direction.getItemAt(i);
            if(item[key] == val) {
                return item;
            }
        }
        return null;
    }

    public getDirectionNewIndex(url:string): number {
        var max = 0;
        for(var i = 0;i < this.direction.length;i++) {
            var item = this.direction.getItemAt(i);
            if(item.url == url || item.url.slice(0,url.length) == url && item.url.charAt(url.length) == "/") {
                max = i + 1; 
            }
        }
        return max;
    }
    
    public hasFloderInThePath(url:string):boolean {
        for(var i = 0;i < this.direction.length; i++) {
            var file: FileInfo;
            file = this.direction.getItemAt(i);
            if(file.parent && file.parent.url == url && file.type == LocalFileType.DIRECTION) {
                return true;
            }
        }
        return false;
    }

    public addFloderToTheSameFloderFile(url: string):void {
        for(var i = 0;i < this.direction.length;i++) {
            var file: FileInfo;
            file = this.direction.getItemAt(i);
            if(file.parent && file.parent.url == url) {
                file.hasFloder = true;
            }
        }
    }
    
    /**
     * @param url 后面可带 / 也可不带，不是全路径，不带文件夹名称
     */ 
    public addFloder(url:string,name,desc:string=""):void {
        if(url.charAt(url.length - 1) == "/") url = url.slice(0,url.length-1);
        var dirName = name;
        if(this.addPathDesc[url + "/" + name]) {
            delete this.addPathDesc[url + "/" + name];
        }
        if(desc != "") {
            this.addPathDesc(url + "/" + name,desc);
            dirName = desc;
        }
        var floder = new FileInfo(url + "/" + name,dirName,null,null,LocalFileType.DIRECTION,"close",url.split("/").length);
        floder.parent = this.getDirection("url",url);
        floder.hasFloder = true;
        this.addFloderToTheSameFloderFile(url);
        floder.dataList = this.direction;
        floder.more = this;
        this.direction.addItemAt(floder,this.getDirectionNewIndex(url));
        this.addFloderToTheSameFloderFile(url);
        this.direction.dispatchEvent(new egret.Event(eui.CollectionEventKind.UPDATE));
    }
    
    /**
     * @param url 全路径，带文件名和后缀
     * @param name
     * @param desc 如果没有传 null 或者 ""
     * @param format 文件格式
     * @param data 文件内容
     */ 
    public addFile(url,name,desc,format,data):FileInfo {
        desc = desc || "";
        if(url.charAt(url.length - 1) == "/") url = url.slice(0,url.length - 1);
        var dirName = name;
        var nameEnd = "json";
        var path = url + "/" + name + "." + nameEnd;
        if(desc != "") {
            dirName = desc;
        }
        if(format == "model") {
            this.models.push(data);
        }
        if(format == "view") {
            this.views.push(data);
        }
        if(format == "data") {
            this.datas.push(data);
        }
        if(format == "animation") {
            this.animations.push(data);
        }
        if(format == "spritesSheet") {
            this.spritesSheets.push(data);
        }
        if(format == "image") {
            this.images.push(data);
        }
        var newFile = new FileInfo(path,dirName,format,"json",LocalFileType.FILE,"close",path.split("/").length - 1);
        newFile.parent = this.getDirection("url",url);
        newFile.hasFloder = this.hasFloderInThePath(url);
        newFile.dataList = this.direction;
        newFile.data = data;
        newFile.more = this;
        this.direction.addItemAt(newFile,this.getDirectionNewIndex(url));
        return newFile;
    }
    
    public updateFile(url,name,desc,format,data):void {
        
    }
    
    public delFile(url,format):void {
        for(var i = 0;i < this.direction.length;i++) {
            var item = this.direction.getItemAt(i);
            if(item.url == url) {
                this.direction.removeItemAt(i);
                break;
            }
        }
        delete this.pathDesc[url];
        if(!this.delData(url,format)) {
            throw "没有扎到对应的文件信息";
        }
    }
    
    public getData(url: string,format: string): FileInfoBase {
        var list: Array<FileInfoBase>;
        if(format == "model") {
            list = this.models;
        }
        if(format == "view") {
            list = this.views;
        }
        if(format == "data") {
            list = this.datas;
        }
        if(format == "animation") {
            list = this.animations;
        }
        if(format == "spritesSheet") {
            list = this.spritesSheets;
        }
        if(format == "image") {
            list = this.images;
        }
        var find = false;
        for(var i = 0;i < list.length;i++) {
            if(list[i].url == url) {
                return list[i];
            }
        }
        return null;
    }
    
    private delData(url,format): boolean {
        var list: Array<FileInfoBase>;
        if(format == "model") {
            list = this.models;
        }
        if(format == "view") {
            list = this.views;
        }
        if(format == "data") {
            list = this.datas;
        }
        if(format == "animation") {
            list = this.animations;
        }
        if(format == "spritesSheet") {
            list = this.spritesSheets;
        }
        if(format == "image") {
            list = this.images;
        }
        var find = false;
        for(var i = 0;i < list.length;i++) {
            if(list[i].url == url) {
                list.splice(i,1);
                return true;
            }
        }
        return false;
    }
    
    public delPath(url):void {
        for(var i = 0;i < this.direction.length;i++) {
            var item = this.direction.getItemAt(i);
            if(item.url == url) {
                this.direction.removeItemAt(i);
                break;
            }
        }
        delete this.pathDesc[url];
    }
    
    public addPathDesc(url,desc):void {
        delete this.pathDesc[url];
        if(desc == null || desc == "") {
            return;
        }
        this.pathDesc[url] = desc;
    }
    
    public getPathDesc(url):string {
        return this.pathDesc[url];
    }

    public encodeConfig(): Object {
        var models = [];
        for(var i = 0;i < this.models.length; i++) {
            models.push(this.models[i].url);
        }
        var datas = [];
        for(i = 0;i < this.datas.length; i++) {
            datas.push(this.datas[i].url);
        }
        var paths = [];
        for(i = 0;i < this.direction.length; i++) {
            if(this.direction.getItemAt(i).virtual == false && this.direction.getItemAt(i).type == LocalFileType.DIRECTION) {
                paths.push(this.direction.getItemAt(i).url);
            }
        }
        return {
            model: models,
            data: datas,
            path: paths,
            pathDesc: this.getEncodePathDesc()
        };
    }
    
    public getFileSaveList(): Array<FileInfoBase> {
        var saveList: Array<FileInfoBase> = [];
        for(var i = 0;i < this.models.length;i++) {
            if(this.models[i].isNew == false) {
                saveList.push(this.models[i]);
            }
        }
        return saveList;
    }
    
    private getEncodePathDesc():Object {
        var cfg = {};
        for(var key in this.pathDesc) {
            cfg[key] = this.pathDesc[key];
        }
        var file:FileInfo;
        for(var i = 0;i < this.direction.length; i++) {
            file = this.direction.getItemAt(i);
            if(file.virtual == false && file.type == LocalFileType.FILE) {
                if(file.name != Path.getName(file.url)) {
                    cfg[file.url] = file.name;
                }
            }
        }
        return cfg;
    }
    
    public decodeConfig(val:Object):void {
        
    }
}
