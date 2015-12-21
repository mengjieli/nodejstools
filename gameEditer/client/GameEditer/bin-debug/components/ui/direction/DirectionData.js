/**
 *
 * @author
 *
 */
var DirectionData = (function (_super) {
    __extends(DirectionData, _super);
    function DirectionData(path) {
        _super.call(this);
        this.data = new eui.ArrayCollection();
        this.file = new LocalFile(path);
        this.file.addEventListener(egret.Event.COMPLETE, this.loadFileListComplete, this);
    }
    var d = __define,c=DirectionData;p=c.prototype;
    p.flush = function () {
        this.file.loadDirectionList();
    };
    p.loadFileListComplete = function (event) {
        var list = this.file.list;
        this.data.removeAll();
        var fileList = [];
        for (var i = 0; i < list.length; i++) {
            var end = list[i].url.split(".")[list[i].url.split(".").length - 1];
            var format;
            if (list[i].type == LocalFileType.FILE) {
                format = LocalFileFormat.Text;
                if (end == "png" || end == "jpg") {
                    format = LocalFileFormat.Image;
                }
                else if (end == "json") {
                    format = LocalFileFormat.Json;
                }
                else if (end == "xml") {
                    format = LocalFileFormat.Xml;
                }
                else if (end == "txt") {
                    format = LocalFileFormat.Text;
                }
                else if (end == "html") {
                    format = LocalFileFormat.Html;
                }
            }
            fileList.push(new FileInfo(list[i].url, list[i].url.split("/")[list[i].url.split("/").length - 1], format, end, list[i].type, "close", list[i].url.split("/").length - 1));
        }
        for (i = 0; i < fileList.length; i++) {
            var url = fileList[i].url;
            for (var j = 0; j < fileList.length; j++) {
                var compareURL = fileList[j].url;
                if (compareURL.split("/").length == url.split("/").length - 1 && url.slice(0, compareURL.length) == compareURL) {
                    //                    console.log("找到父级:",url,compareURL);
                    fileList[i].parent = fileList[j];
                    break;
                }
            }
        }
        for (i = 0; i < fileList.length; i++) {
            if (fileList[i].type == LocalFileType.FILE) {
                fileList[i].hasFloder = false;
            }
            else {
                continue;
            }
            for (var j = 0; j < fileList.length; j++) {
                if (fileList[j].type == LocalFileType.DIRECTION) {
                    fileList[i].hasFloder = true;
                    break;
                }
            }
        }
        for (i = 0; i < fileList.length; i++) {
            fileList[i].dataList = this.data;
            this.data.addItem(fileList[i]);
        }
        this.dispatchEventWith(egret.Event.COMPLETE);
    };
    return DirectionData;
})(egret.EventDispatcher);
egret.registerClass(DirectionData,"DirectionData");
