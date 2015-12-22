/**
 *
 * @author
 *
 */
var ProjectData = (function (_super) {
    __extends(ProjectData, _super);
    function ProjectData() {
        _super.call(this);
        /**
         * 项目名称
         */
        this.name = "";
        /**
         * 模块列表
         */
        this.models = [];
        /**
         * 模块列表
         */
        this.views = [];
        /**
         * 数据列表
         */
        this.datas = [];
        this.pathDesc = {};
        this.direction = new eui.ArrayCollection();
        var list = ProjectDirectionData.data;
        for (var i = 0; i < list.length; i++) {
            var name = list[i].name;
            var direction = this[name + "Direction"] = new FileInfo(list[i].src, list[i].desc, null, null, LocalFileType.DIRECTION, "close", list[i].depth);
            direction.dataList = this.direction;
            direction.more = this;
            direction.more2 = list[i]["more2" + ""];
            if (list[i].parent) {
                direction.parent = this[list[i].parent + "Direction"];
            }
            this.direction.addItem(direction);
        }
    }
    var d = __define,c=ProjectData;p=c.prototype;
    p.loadConfig = function (direction) {
        this.path = direction;
        this.configURL = "editerProject.json";
        this.localDirection = new DirectionData(this.path);
        this.localDirection.flush();
        this.localDirection.addEventListener(egret.Event.COMPLETE, this.onInitFlushLocalDirection, this);
        var e = new LoadingEvent(LoadingEvent.START);
        e.title = "加载项目配置";
        e.tip = "加载项目文件夹信息";
        this.dispatchEvent(e);
    };
    p.onInitFlushLocalDirection = function (e) {
        this.localDirection.removeEventListener(egret.Event.COMPLETE, this.onInitFlushLocalDirection, this);
        var le = new LoadingEvent(LoadingEvent.PROGRESS);
        le.tip = "加载主配置文件";
        le.progress = 0.05;
        this.dispatchEvent(le);
        RES.getResByUrl(Config.localResourceServer + "/" + this.configURL, this.onLoadConfig, this);
    };
    p.onLoadConfig = function (data) {
        var le = new LoadingEvent(LoadingEvent.PROGRESS);
        le.tip = "加载模块信息";
        le.progress = 0.1;
        this.dispatchEvent(le);
        //TODO 还有没做的
        this.dispatchEvent(new LoadingEvent(LoadingEvent.COMPLETE));
    };
    p.getDirection = function (key, val) {
        for (var i = 0; i < this.direction.length; i++) {
            var item = this.direction.getItemAt(i);
            if (item[key] == val) {
                return item;
            }
        }
        return null;
    };
    p.getDirectionNewIndex = function (url) {
        var max = 0;
        for (var i = 0; i < this.direction.length; i++) {
            var item = this.direction.getItemAt(i);
            if (item.url == url || item.url.slice(0, url.length) && item.url.charAt(url.length) == "/") {
                max = i + 1;
            }
        }
        return max;
    };
    p.hasFloderInThePath = function (url) {
        for (var i = 0; i < this.direction.length; i++) {
            var file;
            file = this.direction.getItemAt(i);
            if (file.parent && file.parent.url == url && file.type == LocalFileType.DIRECTION) {
                return true;
            }
        }
        return false;
    };
    p.addFloderToTheSameFloderFile = function (url) {
        for (var i = 0; i < this.direction.length; i++) {
            var file;
            file = this.direction.getItemAt(i);
            if (file.parent && file.parent.url == url) {
                file.hasFloder = true;
            }
        }
    };
    p.addFloder = function (url, name, desc, complete, thisObj) {
        if (complete === void 0) { complete = null; }
        if (thisObj === void 0) { thisObj = null; }
        var file = new LocalFile(Config.workFile + url + "/" + name + "/");
        file.addEventListener(egret.Event.COMPLETE, function (e) {
            file.dispose();
            var dirName = name;
            if (desc != "") {
                this.pathDesc[url + "/" + name] = desc;
                dirName = desc;
            }
            var floder = new FileInfo(url + "/" + name, dirName, null, null, LocalFileType.DIRECTION, "close", url.split("/").length);
            floder.parent = this.getDirection("url", url);
            floder.hasFloder = true;
            this.addFloderToTheSameFloderFile(url);
            floder.dataList = this.direction;
            floder.more = this;
            this.direction.addItemAt(floder, this.getDirectionNewIndex(url));
            this.addFloderToTheSameFloderFile(url);
            this.direction.dispatchEvent(new egret.Event(eui.CollectionEventKind.UPDATE));
            if (complete) {
                complete.call(thisObj);
            }
        }, this);
        file.makeDirection();
    };
    p.addFile = function (fileType, url, name, desc, complete, thisObj) {
        if (complete === void 0) { complete = null; }
        if (thisObj === void 0) { thisObj = null; }
        var data;
        if (fileType == "data") {
            data = new DataInfo(url, name, desc);
        }
        else if (fileType == "spritesSheet") {
            data = new SpritesSheetInfo(url, name, desc);
        }
        var file = new LocalFile(Config.workFile + data.url);
        file.addEventListener(egret.Event.COMPLETE, function (e) {
            file.dispose();
            var dirName = name;
            if (desc != "") {
                this.pathDesc[data.url] = desc;
                dirName = desc;
            }
            var newFile = new FileInfo(data.url, dirName, "data", "json", LocalFileType.FILE, "close", data.url.split("/").length - 1);
            newFile.parent = this.getDirection("url", url);
            newFile.hasFloder = this.hasFloderInThePath(url);
            newFile.dataList = this.direction;
            newFile.more = this;
            this.direction.addItemAt(newFile, this.getDirectionNewIndex(url));
            if (complete) {
                complete.call(thisObj);
            }
        }, this);
        file.saveFile(data.fileContent);
    };
    p.encodeConfig = function () {
        return {};
    };
    p.decodeConfig = function (val) {
    };
    return ProjectData;
})(egret.EventDispatcher);
egret.registerClass(ProjectData,"ProjectData");
