/**
 * Created by mengjieli on 16/3/24.
 * 文件同步模块
 */
require("./../../tools/com/requirecom");
require("./../../tools/net/requirenet");

var srcEnd = ["js"];
var resEnd = ["png", "jpg", "json", "xml", "csv", "txt", "html", "plist"];

var fs = require("fs"),
    path = require("path");

/**
 * 获取参数
 * @param index
 * @returns {*}
 */
function getArg(index) {
    if (process.argv.length > index) {
        return process.argv[index];
    }
    return null;
}

/**
 * 文件信息
 * @constructor
 */

var direction = path.resolve(process.cwd(), getArg(2));
if (direction.charAt(direction.length - 1) != "/") {
    direction += "/";
}
var serverIp = getArg(3);
var serverPort = getArg(4);
var user = getArg(5);
//更新次数
var updateTime = parseInt(getArg(6)) || 100000000;
var updateType = 1;
var firstCheck = true;


var FileClient = (function (_super) {

    __extends(LocalClient, _super);

    function LocalClient() {
        _super.call(this);
    }

    var d = __define, c = LocalClient;
    var p = c.prototype;

    p.receiveData = function (message) {
        if (message.type == "binary") {
            var data = message.binaryData;
            var bytes = new VByteArray();
            bytes.readFromArray(data);
            var cmd = bytes.readUIntV();
            console.log("[client receive]", cmd);
            switch (cmd) {
                case 0:
                    var cmd = bytes.readUIntV();
                    var code = bytes.readUIntV();
                    //console.log(cmd,code);
                    if (code != 0) {
                        this.print("Error", "ErrorCode : " + code);
                    }
                    if (cmd == 1 && code) {
                        this.print("Error", "File client login fail.");
                        this.close();
                    } else {
                        this.success(cmd);
                    }
                    break;
                case 9:
                    this.startCheckDirection(bytes);
                    break;
                case 11:
                    this.sendFileToServer(bytes);
                    break;
                case 13:
                    saveVersionFile();
                    updateTime--;
                    if (updateTime <= 0) {
                        this.close();
                    }
                    break;
            }
        }
    }

    //开始检查客户端的文件信息
    p.startCheckDirection = function (bytes) {
        var changeLength = checkDirection();
        if (changeLength || firstCheck) {
            //发送版本信息到服务器
            var content = getVersionFileContent();
            var len = Math.ceil(content.length / 5000);
            var ind = 0;
            var sendFunc = function () {
                var bytes = new VByteArray();
                bytes.writeUIntV(10);
                bytes.writeUIntV(len);
                bytes.writeUIntV(ind);
                bytes.writeUTFV(content.slice(ind * 5000, (ind + 1) * 5000 > content.length ? content.length : (ind + 1) * 5000));
                this.sendData(bytes);
                ind++;
                if (ind == len) {
                    firstCheck = false;
                } else {
                    setTimeout(sendFunc, 1);
                }
            }.bind(this);
            sendFunc();
        } else {
            updateTime--;
            if (updateTime <= 0) {
                this.close();
                return;
            }
            //发送版本信息到服务器
            var bytes = new VByteArray();
            bytes.writeUIntV(10);
            bytes.writeUTFV("no");
            this.sendData(bytes);
        }
    }

    //发送服务端请求的文件信息
    p.sendFileToServer = function (bytes) {
        var url = bytes.readUTFV();
        var file = new File(direction + url);
        //console.log("send file", url);
        var content;
        if (!file.isExist()) {
            content = new Buffer();
        } else {
            content = file.readContent("binary", "Buffer");
        }
        var start = 0;
        var length = content.length;
        var end;
        var _this = this;
        var sendFileContent = function () {
            if (length - start > 1000000) {
                end = start + 1000000;
            } else {
                end = length;
            }
            var msg = new VByteArray();
            msg.writeUIntV(12);
            msg.writeUTFV(url);
            msg.writeUIntV(start);
            msg.writeUIntV(end);
            msg.writeUIntV(length);
            msg.writeUIntV(end - start);
            //console.log("send file", url, start, "->", end, "  len=", content.length);
            var list = [];
            for (var i = start; i < end; i++) {
                msg.writeByte(content[i]);
                list.push(content[i]);
            }
            _this.sendData(msg);
            start = end;
            if (start < length) {
                setTimeout(sendFileContent, 0);
            }
        }
        sendFileContent();
    }

    p.onConnect = function (connection) {
        _super.prototype.onConnect.call(this, connection);
        var bytes = new VByteArray();
        bytes.writeUIntV(1);
        bytes.writeUTFV(user);
        this.sendData(bytes);
        var _this = this;
        setTimeout(function () {
            //var bytes = new VByteArray();
            //bytes.writeByte(0);
            //bytes.writeByte(0);
            //bytes.writeByte(0);
            //bytes.writeByte(0);
            //_this.sendData(bytes);
        }, 10000);
    }

    p.success = function (cmd) {
        if (cmd == 1) {
            console.log("login complete");
            //登录成功
        } else {
            console.log("login fail!");
        }
    }

    p.sendData = function (bytes) {
        bytes.position = 0;
        console.log("[send to server]", bytes.readUIntV(), "  len=", bytes.length);
        this.connection.sendBytes(new Buffer(bytes.data));
    }

    p.close = function () {
        //console.log("I want close ,why?", arguments.callee.caller);
        this.connection.close();
    }

    p.onClose = function () {
        console.log("close?!", arguments);
        _super.prototype.onClose.call(this);
    }

    p.print = function (type, msg) {
        var cfg = {
            "type": type,
            "msg": msg
        }
        console.log(JSON.stringify(cfg))
    }

    return LocalClient;

})(WebScoektClient);


/**
 * 链接服务器
 */


var saveVersionFile = function () {
    var content = JSON.stringify(localFileList);
    versionFile.save(content);
}

var getVersionFileContent = function () {
    return JSON.stringify(localFileList);
}

var localFileList;
var versionFile = new File(direction + "version.json");
console.log("version file:", direction + "version.json", "   path=", process.cwd(), versionFile.isExist() ? "true" : "false");
if (versionFile.isExist()) {
    try {
        localFileList = JSON.parse(versionFile.readContent());
        if (!localFileList.length) {
            localFileList = [];
        }
    } catch (e) {
        localFileList = [];
        saveVersionFile();
    }
} else {
    localFileList = [];
    saveVersionFile();
}


var server = new FileClient();
server.connect(serverIp, serverPort);


//var updateList;

/**
 * 检查并与服务器同步文件信息
 */
var checkDirection = function () {
    //updateList = [];
    console.log("\n", "start check direction");
    var list = [];
    var file;
    if (updateType == 1 || updateType == 2) {
        file = new File(direction + "src/");
        //console.log(file.url,file.isExist());
        fileList = file.readFilesWidthEnd(srcEnd);
        list = list.concat(fileList);
    }
    if (updateType == 1 || updateType == 3) {
        file = new File(direction + "res/");
        fileList = file.readFilesWidthEnd(resEnd);
        list = list.concat(fileList);
    }
    console.log("localFileList", localFileList.length, list.length);
    var vfile;
    var changeFileCount = 0;
    for (var i = 0; i < localFileList.length; i++) {
        localFileList[i].flag = 0;
    }
    for (var i = 0; i < list.length; i++) {
        file = list[i];
        var url = file.url;
        if (url == versionFile.url) {
            continue;
        }
        url = url.slice(direction.length, url.length);
        vfile = null;
        for (var f = 0; f < localFileList.length; f++) {
            if (localFileList[f].url == url) {
                vfile = localFileList[f];
                localFileList[f].flag = 1;
                break;
            }
        }
        if (!vfile) {
            vfile = {
                "url": url,
                "modifyTime": 0,
                "createTime": 0,
                "md5": ""
            }
            localFileList.push(vfile);
        }
        if (vfile.modifyTime != file.modifyTime || vfile.createTime != file.createTime) {
            var fileContent = file.readContent("binary", "Buffer");
            var compare = md5(fileContent);
            if (vfile.md5 != compare) {
                vfile.md5 = compare;
                changeFileCount++;
                //console.log("[change file]", url);
                //updateList.push({"url":url,"content":fileContent});
            } else {
                //console.log("same:",vfile.url);
            }
            vfile.createTime = file.createTime;
            vfile.modifyTime = file.modifyTime;
        }
    }
    for (var i = 0; i < localFileList.length; i++) {
        if (localFileList[i].flag == 0) {
            changeFileCount++;
            //console.log("[delete file]", localFileList[i].url);
            localFileList.splice(i, 1);
            i--;
        } else {
            delete localFileList[i].flag;
        }
    }
    if (changeFileCount) {
        //console.log("File change :", changeFileCount);
    }
    return changeFileCount;
}

//var now = new Date().getTime();
//checkDirection();
//console.log(new Date().getTime() - now);