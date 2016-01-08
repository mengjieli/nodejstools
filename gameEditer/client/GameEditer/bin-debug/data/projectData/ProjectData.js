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
        /**
         * 动画
         */
        this.animations = [];
        /**
         * SpritesSheet
         */
        this.spritesSheets = [];
        /**
         * 图片
         */
        this.images = [];
        /**
         * 电脑上的目录信息
         */
        //    private localDirection: DirectionData;
        this.pathDesc = {};
        this.direction = new eui.ArrayCollection();
        var list = ProjectDirectionData.data;
        for (var i = 0; i < list.length; i++) {
            var name = list[i].name;
            var direction = this[name + "Direction"] = new FileInfo(list[i].src, list[i].desc, null, null, LocalFileType.DIRECTION, "close", list[i].depth);
            direction.dataList = this.direction;
            direction.more = this;
            direction.more2 = list[i]["more2" + ""];
            direction.virtual = true;
            if (list[i].parent) {
                direction.parent = this[list[i].parent + "Direction"];
            }
            this.direction.addItem(direction);
        }
    }
    var d = __define,c=ProjectData;p=c.prototype;
    p.hasPath = function (url) {
        for (var i = 0; i < this.direction.length; i++) {
            var item = this.direction.getItemAt(i);
            if (item.url == url) {
                return true;
            }
        }
        return false;
    };
    p.getFile = function (url) {
        for (var i = 0; i < this.direction.length; i++) {
            var item = this.direction.getItemAt(i);
            if (item.url == url) {
                return item;
            }
        }
        return null;
    };
    p.getFileInPath = function (url) {
        var list = [];
        for (var i = 0; i < this.direction.length; i++) {
            var item = this.direction.getItemAt(i);
            if (item.url.slice(0, url.length) == url && item.url.charAt(url.length) == "/") {
                list.push(item);
            }
        }
        return list;
    };
    p.getLocalFile = function (url) {
        for (var i = 0; i < this.direction.length; i++) {
            var item = this.direction.getItemAt(i);
            if (item.url == url) {
                return item;
            }
        }
        return null;
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
            if (item.url == url || item.url.slice(0, url.length) == url && item.url.charAt(url.length) == "/") {
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
    /**
     * @param url 后面可带 / 也可不带，不是全路径，不带文件夹名称
     */
    p.addFloder = function (url, name, desc) {
        if (desc === void 0) { desc = ""; }
        if (url.charAt(url.length - 1) == "/")
            url = url.slice(0, url.length - 1);
        var dirName = name;
        if (this.addPathDesc[url + "/" + name]) {
            delete this.addPathDesc[url + "/" + name];
        }
        if (desc != "") {
            this.addPathDesc(url + "/" + name, desc);
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
    };
    /**
     * @param url 全路径，带文件名和后缀
     * @param name
     * @param desc 如果没有传 null 或者 ""
     * @param format 文件格式
     * @param data 文件内容
     */
    p.addFile = function (url, name, desc, format, data) {
        desc = desc || "";
        if (url.charAt(url.length - 1) == "/")
            url = url.slice(0, url.length - 1);
        var dirName = name;
        var nameEnd = "json";
        var path = url + "/" + name + "." + nameEnd;
        if (desc != "") {
            dirName = desc;
        }
        if (format == "model") {
            this.models.push(data);
        }
        if (format == "view") {
            this.views.push(data);
        }
        if (format == "data") {
            this.datas.push(data);
        }
        if (format == "animation") {
            this.animations.push(data);
        }
        if (format == "spritesSheet") {
            this.spritesSheets.push(data);
        }
        if (format == "image") {
            this.images.push(data);
        }
        var newFile = new FileInfo(path, dirName, format, "json", LocalFileType.FILE, "close", path.split("/").length - 1);
        newFile.parent = this.getDirection("url", url);
        newFile.hasFloder = this.hasFloderInThePath(url);
        newFile.dataList = this.direction;
        newFile.data = data;
        newFile.more = this;
        this.direction.addItemAt(newFile, this.getDirectionNewIndex(url));
        return newFile;
    };
    p.updateFile = function (url, name, desc, format, data) {
    };
    p.delFile = function (url, format) {
        for (var i = 0; i < this.direction.length; i++) {
            var item = this.direction.getItemAt(i);
            if (item.url == url) {
                this.direction.removeItemAt(i);
                break;
            }
        }
        delete this.pathDesc[url];
        if (!this.delData(url, format)) {
            throw "没有扎到对应的文件信息";
        }
    };
    p.getData = function (url, format) {
        var list;
        if (format == "model") {
            list = this.models;
        }
        if (format == "view") {
            list = this.views;
        }
        if (format == "data") {
            list = this.datas;
        }
        if (format == "animation") {
            list = this.animations;
        }
        if (format == "spritesSheet") {
            list = this.spritesSheets;
        }
        if (format == "image") {
            list = this.images;
        }
        var find = false;
        for (var i = 0; i < list.length; i++) {
            if (list[i].url == url) {
                return list[i];
            }
        }
        return null;
    };
    p.delData = function (url, format) {
        var list;
        if (format == "model") {
            list = this.models;
        }
        if (format == "view") {
            list = this.views;
        }
        if (format == "data") {
            list = this.datas;
        }
        if (format == "animation") {
            list = this.animations;
        }
        if (format == "spritesSheet") {
            list = this.spritesSheets;
        }
        if (format == "image") {
            list = this.images;
        }
        var find = false;
        for (var i = 0; i < list.length; i++) {
            if (list[i].url == url) {
                list.splice(i, 1);
                return true;
            }
        }
        return false;
    };
    p.delPath = function (url) {
        for (var i = 0; i < this.direction.length; i++) {
            var item = this.direction.getItemAt(i);
            if (item.url == url) {
                this.direction.removeItemAt(i);
                break;
            }
        }
        delete this.pathDesc[url];
    };
    p.addPathDesc = function (url, desc) {
        delete this.pathDesc[url];
        if (desc == null || desc == "") {
            return;
        }
        this.pathDesc[url] = desc;
    };
    p.getPathDesc = function (url) {
        return this.pathDesc[url];
    };
    p.encodeConfig = function () {
        var models = [];
        for (var i = 0; i < this.models.length; i++) {
            models.push(this.models[i].url);
        }
        var datas = [];
        for (i = 0; i < this.datas.length; i++) {
            datas.push(this.datas[i].url);
        }
        var paths = [];
        for (i = 0; i < this.direction.length; i++) {
            if (this.direction.getItemAt(i).virtual == false && this.direction.getItemAt(i).type == LocalFileType.DIRECTION) {
                paths.push(this.direction.getItemAt(i).url);
            }
        }
        return {
            model: models,
            data: datas,
            path: paths,
            pathDesc: this.getEncodePathDesc()
        };
    };
    p.getFileSaveList = function () {
        var saveList = [];
        for (var i = 0; i < this.models.length; i++) {
            if (this.models[i].isNew == false) {
                saveList.push(this.models[i]);
            }
        }
        return saveList;
    };
    p.getEncodePathDesc = function () {
        var cfg = {};
        for (var key in this.pathDesc) {
            cfg[key] = this.pathDesc[key];
        }
        var file;
        for (var i = 0; i < this.direction.length; i++) {
            file = this.direction.getItemAt(i);
            if (file.virtual == false && file.type == LocalFileType.FILE) {
                if (file.name != Path.getName(file.url)) {
                    cfg[file.url] = file.name;
                }
            }
        }
        return cfg;
    };
    p.decodeConfig = function (val) {
    };
    return ProjectData;
})(egret.EventDispatcher);
egret.registerClass(ProjectData,"ProjectData");
