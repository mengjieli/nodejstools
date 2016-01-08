/**
 *
 * @author
 *
 */
var ProjectDirectionCommand = (function () {
    function ProjectDirectionCommand(project) {
        this.project = project;
    }
    var d = __define,c=ProjectDirectionCommand;p=c.prototype;
    /**
     * 新建文件夹
     */
    p.addFloder = function (url, name, desc, complete, thisObj) {
        if (complete === void 0) { complete = null; }
        if (thisObj === void 0) { thisObj = null; }
        var project = this.project;
        var file = new LocalFile(Config.workFile + url + "/" + name + "/");
        file.addEventListener(egret.Event.COMPLETE, function (e) {
            file.dispose();
            project.addFloder(url, name, desc);
            if (complete) {
                complete.call(thisObj);
            }
        }, this);
        file.makeDirection();
    };
    /**
     * 新建文件
     */
    p.addFile = function (fileType, url, name, desc, complete, thisObj) {
        if (complete === void 0) { complete = null; }
        if (thisObj === void 0) { thisObj = null; }
        var project = this.project;
        var data;
        if (fileType == "model") {
            data = new ModelInfo(url, name, desc);
        }
        else if (fileType == "data") {
            data = new DataInfo(url, name, desc);
        }
        else if (fileType == "spritesSheet") {
            data = new SpritesSheetInfo(url, name, desc);
        }
        if (!data) {
            return;
        }
        var file = new LocalFile(Config.workFile + data.url);
        file.addEventListener(egret.Event.COMPLETE, function (e) {
            file.dispose();
            project.addFile(url, name, desc, fileType, data);
            if (complete) {
                complete.call(thisObj);
            }
        }, this);
        file.saveFile(data.fileContent);
    };
    /**
     * 刷新目录
     */
    p.freshFloder = function (path, format) {
        var project = this.project;
        var dispather = new egret.EventDispatcher();
        new LoadingView(dispather);
        var start = new LoadingEvent(LoadingEvent.START);
        start.title = "刷新文件夹 " + path;
        dispather.dispatchEvent(start);
        var file = new LocalFile(Config.workFile + path);
        var _this = this;
        //1. 获取目录结构
        file.addEventListener(egret.Event.COMPLETE, function (e) {
            var list = file.list;
            if (list.length == 0) {
                file.dispose();
                dispather.dispatchEvent(new LoadingEvent(LoadingEvent.COMPLETE));
                return;
            }
            for (var n = 0; n < list.length; n++) {
                list[n].url = path + list[n].url;
            }
            //2. 移除目录结构之外的文件
            var projectList = project.getFileInPath(path);
            var find;
            for (var m = 0; m < projectList.length; m++) {
                if (projectList[m].virtual)
                    continue;
                find = false;
                for (var n = 0; n < list.length; n++) {
                    if (list[n].url == projectList[m].url) {
                        find = true;
                        break;
                    }
                }
                if (find == false) {
                    if (projectList[m].type == LocalFileType.DIRECTION) {
                        project.delPath(projectList[m].url);
                    }
                    else if (projectList[m].type == LocalFileType.FILE) {
                        project.delFile(projectList[m].url, format);
                    }
                }
            }
            var index = 0;
            var updateNextFile = function () {
                if (index) {
                    var progressEvent = new LoadingEvent(LoadingEvent.PROGRESS);
                    progressEvent.progress = index;
                    dispather.dispatchEvent(progressEvent);
                }
                var localFile = list[index];
                var name;
                var url;
                if (!project.hasPath(localFile.url)) {
                    if (localFile.type == LocalFileType.DIRECTION) {
                        name = localFile.url.split("/")[localFile.url.split("/").length - 1];
                        url = localFile.url.slice(0, localFile.url.length - name.length);
                        project.addFloder(url, name, project.getPathDesc(url));
                        updateNextFileComplete();
                    }
                    else if (localFile.type == LocalFileType.FILE) {
                        var load = RES.getResByUrl(Config.getResourceURL(localFile.url), function (config) {
                            _this.addNewFile(config, format, localFile.url);
                            updateNextFileComplete();
                        }, this, RES.ResourceItem.TYPE_JSON);
                    }
                }
                else {
                    if (localFile.type == LocalFileType.DIRECTION) {
                        updateNextFileComplete();
                    }
                    else if (localFile.type == LocalFileType.FILE) {
                        var load = RES.getResByUrl(Config.getResourceURL(localFile.url), function (config) {
                            _this.updateFile(project.getData(localFile.url, format), config, format, localFile.url);
                            updateNextFileComplete();
                        }, this, RES.ResourceItem.TYPE_JSON);
                    }
                }
            };
            var updateNextFileComplete = function () {
                index++;
                if (index < list.length) {
                    updateNextFile();
                }
                else {
                    file.dispose();
                    dispather.dispatchEvent(new LoadingEvent(LoadingEvent.COMPLETE));
                }
            };
            updateNextFile();
        }, this);
        file.loadDirectionList();
    };
    p.freshFile = function (url, format) {
        var project = this.project;
        var dispather = new egret.EventDispatcher();
        new LoadingView(dispather);
        var start = new LoadingEvent(LoadingEvent.START);
        start.title = "刷新文件 " + url;
        dispather.dispatchEvent(start);
        var file = new LocalFile(Config.workFile + url);
        var _this = this;
        file.addEventListener(egret.Event.COMPLETE, function (e) {
            file.dispose();
            if (!file.exist) {
                project.delFile(url, format);
                dispather.dispatchEvent(new LoadingEvent(LoadingEvent.COMPLETE));
            }
            else {
                if (!project.hasPath(url)) {
                    var load = RES.getResByUrl(Config.getResourceURL(url), function (config) {
                        _this.addNewFile(config, format, url);
                    }, this, RES.ResourceItem.TYPE_JSON);
                }
                else {
                    var load = RES.getResByUrl(Config.getResourceURL(url), function (config) {
                        _this.updateFile(project.getData(url, format), config, format, url);
                        dispather.dispatchEvent(new LoadingEvent(LoadingEvent.COMPLETE));
                    }, this, RES.ResourceItem.TYPE_JSON);
                }
            }
        }, this);
        file.isExist();
    };
    p.addNewFile = function (config, format, localURL) {
        var project = this.project;
        var data;
        switch (format) {
            case "data":
                if (typeof config != "object") {
                    break;
                }
                data = DataInfo.decode(Path.getPath(localURL), config);
                if (data) {
                    project.addFile(Path.getPath(localURL), config.name, config.desc, format, data);
                }
                break;
            case "model":
                if (typeof config != "object") {
                    break;
                }
                data = ModelInfo.decode(Path.getPath(localURL), config);
                if (data) {
                    project.addFile(Path.getPath(localURL), config.name, config.desc, format, data);
                }
                break;
        }
    };
    p.updateFile = function (projectFile, config, format, localURL) {
        var project = this.project;
        var file = project.getFile(localURL);
        var data;
        switch (format) {
            case "model":
                if (typeof config != "object") {
                    break;
                }
                data = ModelInfo.decode(Path.getPath(localURL), config);
                if (data) {
                    projectFile.update(data);
                    var dirName = config.name;
                    if (config.desc != "") {
                        dirName = config.desc;
                    }
                    project.getFile(localURL).name = dirName;
                    project.direction.dispatchEvent(new eui.CollectionEvent(eui.CollectionEventKind.UPDATE));
                }
                break;
            case "data":
                if (typeof config != "object") {
                    break;
                }
                data = DataInfo.decode(Path.getPath(localURL), config);
                if (data) {
                    projectFile.update(data);
                    var dirName = config.name;
                    if (config.desc != "") {
                        dirName = config.desc;
                    }
                    project.getFile(localURL).name = dirName;
                    project.direction.dispatchEvent(new eui.CollectionEvent(eui.CollectionEventKind.UPDATE));
                }
                break;
        }
    };
    return ProjectDirectionCommand;
})();
egret.registerClass(ProjectDirectionCommand,"ProjectDirectionCommand");
