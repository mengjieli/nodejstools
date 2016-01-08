/**
 *
 * @author
 *
 */
var LoadProjectCommand = (function (_super) {
    __extends(LoadProjectCommand, _super);
    function LoadProjectCommand(project, url) {
        _super.call(this);
        this.project = project;
        this.loadConfig(url);
    }
    var d = __define,c=LoadProjectCommand;p=c.prototype;
    p.loadConfig = function (direction) {
        this.project.path = direction;
        this.project.configURL = "editerProject.json";
        var localDirection = new DirectionData(this.project.path);
        localDirection.flush();
        localDirection.addEventListener(egret.Event.COMPLETE, this.onInitFlushLocalDirection, this);
        new LoadingView(this);
        var e = new LoadingEvent(LoadingEvent.START);
        e.title = "加载项目配置";
        e.tip = "加载项目文件夹信息";
        this.dispatchEvent(e);
    };
    p.onInitFlushLocalDirection = function (e) {
        var localDirection = e.currentTarget;
        localDirection.removeEventListener(egret.Event.COMPLETE, this.onInitFlushLocalDirection, this);
        localDirection.dispose();
        var le = new LoadingEvent(LoadingEvent.PROGRESS);
        le.tip = "加载主配置文件";
        le.progress = 0.05;
        this.dispatchEvent(le);
        RES.getResByUrl(Config.getResourceURL(this.project.configURL), this.onLoadConfig, this, RES.ResourceItem.TYPE_JSON);
    };
    p.onLoadConfig = function (config) {
        var le = new LoadingEvent(LoadingEvent.PROGRESS);
        le.tip = "加载模块信息1";
        le.progress = 0.1;
        this.dispatchEvent(le);
        this.project.pathDesc = config.pathDesc;
        var paths = config.path;
        for (var i = 0; i < paths.length; i++) {
            this.project.addFloder(Path.getPath(paths[i]), Path.getName(paths[i]), this.project.getPathDesc(paths[i]));
        }
        var list = config.model;
        this.loadModelList = [];
        var file;
        for (var i = 0; i < list.length; i++) {
            file = this.project.addFile(Path.getPath(list[i]), Path.getName(list[i]), this.project.getPathDesc(list[i]), "model", new ModelInfo(Path.getPath(list[i]), Path.getName(list[i]), this.project.getPathDesc(list[i])));
            this.loadModelList.push(file);
        }
        list = config.data;
        for (var i = 0; i < list.length; i++) {
            file = this.project.addFile(Path.getPath(list[i]), Path.getName(list[i]), this.project.getPathDesc(list[i]), "data", new ModelInfo(Path.getPath(list[i]), Path.getName(list[i]), this.project.getPathDesc(list[i])));
        }
        this.loadModelIndex = 0;
        this.loadNextModel();
    };
    p.loadNextModel = function () {
        var le = new LoadingEvent(LoadingEvent.PROGRESS);
        le.tip = "加载模块信息" + this.loadModelIndex + "/" + this.loadModelList.length;
        le.progress = 0.1 + 0.2 * (this.loadModelIndex / this.loadModelList.length);
        this.dispatchEvent(le);
        if (this.loadModelIndex < this.loadModelList.length) {
            var file = this.loadModelList[this.loadModelIndex];
            RES.getResByUrl(Config.getResourceURL(file.url), function (config) {
                var project = this.project;
                (new ProjectDirectionCommand(project)).updateFile(project.getData(file.url, LocalFileFormat.MODEL), config, LocalFileFormat.MODEL, file.url);
                file.hasLoad = true;
                this.loadNextModel();
            }, this, RES.ResourceItem.TYPE_JSON);
            this.loadModelIndex++;
        }
        else {
            //TODO 还有没做的
            this.dispatchEvent(new LoadingEvent(LoadingEvent.COMPLETE));
        }
    };
    return LoadProjectCommand;
})(egret.EventDispatcher);
egret.registerClass(LoadProjectCommand,"LoadProjectCommand");
