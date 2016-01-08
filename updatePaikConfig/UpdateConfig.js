/**
 * 从服务器拉取配置，每一定时间间隔同步一次
 * 按 ctrl + c 退出程序
 */

var serverIp = "123.59.49.175";//192.168.1.201:13212/empery/data/
var port = 13212;
var path = "/empery/data/";
var saveFile = "./tmp/"
var fileList = "./tmp/"; //遍历这个文件夹下的文件列表，并写到 writeFileList
var writeFileList = "./tmp/TableList.json";
var writeZip = "./client/UpdateConfigClient/configs/Table.zip";
var tipURL = "configs/Table.zip";
var updateTime = 300 * 1000; //每多少毫秒同步一次，比如 300*1000 为 300 秒同步一次

var UpdateTask = function (complete,thisObj) {
    this.complete = complete;
    this.thisObj = thisObj;
    this.loadConfigList();
}

UpdateTask.prototype.loadConfigList = function () {
    (new File(saveFile)).delete();
    console.log("1. get config list from server.");
    this.httpRequest = new HttpRequest(serverIp, port, path);
    this.httpRequest.addEventListener(Event.DATA, this.recvConfigList, this);
    this.httpRequest.get();
}

UpdateTask.prototype.recvConfigList = function (event) {
    this.httpRequest.removeEventListener(Event.DATA, this.recvConfigList, this);

    var data = JSON.parse(this.httpRequest.data);
    this.list = [];
    for (var key in data) {
        this.list.push(key);
    }
    console.log("2. there are " + this.list.length + " config files.");
    this.index = 0;
    this.getNextConfig();
}

UpdateTask.prototype.getNextConfig = function () {
    if (this.index < this.list.length) {
        this.httpRequest = new HttpRequest(serverIp, port, path + this.list[this.index]);
        this.httpRequest.addEventListener(Event.CLOSE, this.recvConfig, this);
        this.httpRequest.get();
    } else {
        var list = (new File(fileList)).readFilesWidthEnd("txt");
        var resList = [];
        for (var i = 0; i < list.length; i++) {
            var url = list[i].url;
            url = url.slice(fileList.length, url.length);
            var name = url.split("/")[url.split("/").length - 1];
            name = name.split(".")[0];
            resList.push(name);
        }
        console.log("3. save config list to \"" + writeFileList + "\".");
        (new File(writeFileList)).save(JSON.stringify(resList));

        ZipShell.compress([saveFile], "tmp.zip",function(){
            var content = (new File("tmp.zip")).readContent("binary");
            (new File(saveFile)).delete();
            (new File("tmp.zip")).delete();
            new File(writeZip).save(content,"binary");
            if(this.complete) {
                this.complete.call(this.thisObj,tipURL);
            }
        },this);
    }
}

UpdateTask.prototype.recvConfig = function (event) {
    var content = this.httpRequest.data;
    var name = this.list[this.index];
    (new File(saveFile + name + ".txt")).delete();
    (new File(saveFile + name + ".txt")).save(content);
    this.httpRequest.removeEventListener(Event.DATA, this.recvConfig, this);
    this.httpRequest = null;
    this.index++;
    this.getNextConfig();
}

global.UpdateTask = UpdateTask;