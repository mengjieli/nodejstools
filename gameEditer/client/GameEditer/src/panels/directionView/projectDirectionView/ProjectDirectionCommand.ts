/**
 *
 * @author 
 *
 */
class ProjectDirectionCommand {
    
    private project: ProjectData;
    
	public constructor(project:ProjectData) {
        this.project = project;
	}

    /**
     * 新建文件夹
     */
    public addFloder(url: string,name: string,desc: string,complete: Function = null,thisObj: any = null): void {
        var project = this.project;
        var file = new LocalFile(Config.workFile + url + "/" + name + "/");
        file.addEventListener(egret.Event.COMPLETE,function(e: egret.Event): void {
            file.dispose();
            project.addFloder(url,name,desc);
            if(complete) {
                complete.call(thisObj);
            }
        },this);
        file.makeDirection();
    }
    
    /**
     * 新建文件
     */
    public addFile(fileType: string,url: string,name: string,desc: string,complete: Function = null,thisObj: any = null): void {
        var project = this.project;
        var data: FileInfoBase;
        if(fileType == "model") {
            data = new ModelInfo(url,name,desc);
        } else if(fileType == "data") {
            data = new DataInfo(url,name,desc);
        } else if(fileType == "spritesSheet") {
            data = new SpritesSheetInfo(url,name,desc);
        }
        if(!data) {
            return;
        }
        var file = new LocalFile(Config.workFile + data.url);
        file.addEventListener(egret.Event.COMPLETE,function(e: egret.Event): void {
            file.dispose();
            project.addFile(url,name,desc,fileType,data);
            if(complete) {
                complete.call(thisObj);
            }
        },this);
        file.saveFile(data.fileContent);
    }
    
    /**
     * 刷新目录
     */ 
    public freshFloder(path:string,format:string):void {
        var project = this.project;
        var dispather = new egret.EventDispatcher();
        new LoadingView(dispather);
        var start = new LoadingEvent(LoadingEvent.START);
        start.title = "刷新文件夹 " + path;
        dispather.dispatchEvent(start);
        var file = new LocalFile(Config.workFile + path);
        var _this = this;
        //1. 获取目录结构
        file.addEventListener(egret.Event.COMPLETE,function(e: egret.Event): void {
            var list = file.list;
            if(list.length == 0) {
                file.dispose();
                dispather.dispatchEvent(new LoadingEvent(LoadingEvent.COMPLETE));
                return;
            }
            for(var n = 0;n < list.length;n++) {
                list[n].url = path + list[n].url;
            }
            //2. 移除目录结构之外的文件
            var projectList = project.getFileInPath(path);
            var find;
            for(var m = 0;m < projectList.length; m++) {
                if(projectList[m].virtual) continue;
                find = false;
                for(var n = 0;n < list.length; n++) {
                    if(list[n].url == projectList[m].url) {
                        find = true;
                        break;
                    }
                }
                if(find == false) {
                    if(projectList[m].type == LocalFileType.DIRECTION) {
                        project.delPath(projectList[m].url);
                    } else if(projectList[m].type == LocalFileType.FILE) {
                        project.delFile(projectList[m].url,format);
                    }
                }
            }
            var index = 0;
            var updateNextFile = function() {
                if(index) {
                    var progressEvent = new LoadingEvent(LoadingEvent.PROGRESS);
                    progressEvent.progress = index;
                    dispather.dispatchEvent(progressEvent);
                }
                var localFile = list[index];
                var name:string;
                var url:string;
                if(!project.hasPath(localFile.url)) {
                    if(localFile.type == LocalFileType.DIRECTION) {
                        name = localFile.url.split("/")[localFile.url.split("/").length-1];
                        url = localFile.url.slice(0,localFile.url.length - name.length);
                        project.addFloder(url,name,project.getPathDesc(url));
                        updateNextFileComplete();
                    } else if(localFile.type == LocalFileType.FILE){
                        var load = RES.getResByUrl(Config.getResourceURL(localFile.url),function(config){
                            _this.addNewFile(config,format,localFile.url);
                            updateNextFileComplete();
                        },this,RES.ResourceItem.TYPE_JSON);
                    }
                } else {
                    if(localFile.type == LocalFileType.DIRECTION) {
                        updateNextFileComplete();
                    } else if(localFile.type == LocalFileType.FILE) {
                        var load = RES.getResByUrl(Config.getResourceURL(localFile.url),function(config) {
                            _this.updateFile(project.getData(localFile.url,format),config,format,localFile.url);
                            updateNextFileComplete();
                        },this,RES.ResourceItem.TYPE_JSON);
                    } 
                }
            }
            var updateNextFileComplete = function() {
                index++;
                if(index < list.length) {
                    updateNextFile();
                } else {
                    file.dispose();
                    dispather.dispatchEvent(new LoadingEvent(LoadingEvent.COMPLETE));
                }
            }
            updateNextFile();
        },this);
        file.loadDirectionList();
    }
    
    public freshFile(url: string,format: string): void {
        var project = this.project;
        var dispather = new egret.EventDispatcher();
        new LoadingView(dispather);
        var start = new LoadingEvent(LoadingEvent.START);
        start.title = "刷新文件 " + url;
        dispather.dispatchEvent(start);
        var file = new LocalFile(Config.workFile + url);
        var _this = this;
        file.addEventListener(egret.Event.COMPLETE,function(e:egret.Event):void{
            file.dispose();
            if(!file.exist) {
                project.delFile(url,format);
                dispather.dispatchEvent(new LoadingEvent(LoadingEvent.COMPLETE));
            } else {
                if(!project.hasPath(url)) {
                    var load = RES.getResByUrl(Config.getResourceURL(url),function(config) {
                        _this.addNewFile(config,format,url);
                    },this,RES.ResourceItem.TYPE_JSON);
                } else {
                    var load = RES.getResByUrl(Config.getResourceURL(url),function(config) {
                        _this.updateFile(project.getData(url,format),config,format,url);
                        dispather.dispatchEvent(new LoadingEvent(LoadingEvent.COMPLETE));
                    },this,RES.ResourceItem.TYPE_JSON);
                }
            }
        },this);
        file.isExist();
    }
    
    private addNewFile(config,format,localURL:string):void {
        var project = this.project;
        var data: FileInfoBase;
        switch(format) {
            case "data":
                if(typeof config != "object") {
                    break;
                }
                data = DataInfo.decode(Path.getPath(localURL),config);
                if(data) {
                    project.addFile(Path.getPath(localURL),config.name,config.desc,format,data);
                }
                break;
            case "model":
                if(typeof config != "object") {
                    break;
                }
                data = ModelInfo.decode(Path.getPath(localURL),config);
                if(data) {
                    project.addFile(Path.getPath(localURL),config.name,config.desc,format,data);
                }
                break;
        }
    }
    
    public updateFile(projectFile:FileInfoBase,config,format,localURL): void {
        var project = this.project;
        var file = project.getFile(localURL);
        var data: FileInfoBase;
        switch(format) {
            case "model":
                if(typeof config != "object") {
                    break;
                }
                data = ModelInfo.decode(Path.getPath(localURL),config);
                if(data) {
                    projectFile.update(data);
                    var dirName = config.name;
                    if(config.desc != "") {
                        dirName = config.desc;
                    }
                    project.getFile(localURL).name = dirName;
                    project.direction.dispatchEvent(new eui.CollectionEvent(eui.CollectionEventKind.UPDATE));
                }
                break;
            case "data":
                if(typeof config != "object") {
                    break;
                }
                data = DataInfo.decode(Path.getPath(localURL),config);
                if(data) {
                    projectFile.update(data);
                    var dirName = config.name;
                    if(config.desc != "") {
                        dirName = config.desc;
                    }
                    project.getFile(localURL).name = dirName;
                    project.direction.dispatchEvent(new eui.CollectionEvent(eui.CollectionEventKind.UPDATE));
                }
                break;
        }
    }
}
