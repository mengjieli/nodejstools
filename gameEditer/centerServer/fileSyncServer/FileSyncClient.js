var checkGap = 1000;
var fork = require('child_process').fork;

var FileSyncClient = (function (_super) {

    __extends(FileSyncClient, _super);

    function FileSyncClient(connection, big) {
        _super.call(this, connection, big);
        this.type = "binary";
        //console.log(connection.remoteAddress);
        this.ip = connection.remoteAddress.split(":")[connection.remoteAddress.split(":").length - 1];
    }

    var d = __define, c = FileSyncClient;
    p = c.prototype;

    p.init = function (server, id) {
        this.httpServer = null;
        this.server = server;
        this.id = id;
        this.zip = fork("./fileSyncServer/ZipFile.js");
        this.zip.on('message', this.onZipMessage.bind(this));
        var ip = System.IP;
        var port = global.httpServerPort;
        var content = (new File("./data/update/project.manifest")).readContent();
        content = StringDo.replaceString(content, "{$ip}", ip);
        content = StringDo.replaceString(content, "{$port}", port);
        this.projectCfg = JSON.parse(content);
        content = (new File("./data/update/version.manifest")).readContent();
        content = StringDo.replaceString(content, "{$ip}", ip);
        content = StringDo.replaceString(content, "{$port}", port);
        this.versionCfg = JSON.parse(content);
    }

    p.receiveData = function (message) {
        var data;
        if (message.type == "utf8") {
            this.type = "utf8";
            data = JSON.parse(message.utf8Data);
        }
        else if (message.type == "binary") {
            var data = message.binaryData;
        }
        var bytes = new VByteArray();
        bytes.readFromArray(data);
        var cmd = bytes.readUIntV();
        switch (cmd) {
            case 0:
                return;
            case 1:
                //登录
                this.login(bytes);
                return;
            case 10: //收到整个目录的文件列表信息
                this.receiveDirectionList(bytes);
                return;
            case 12: //收到单个文件内容
                this.receiveFileContent(bytes);
                return;
        }
    }

    p.login = function (bytes) {
        var name = bytes.readUTFV();
        //console.log(global.name, ":", name, name == global.name);
        if (name == global.name) {
            this.root = "./data/user/" + global.name + "/";
            this.success(1);
            this.requestCheckDirection();
        } else {
            this.close();
        }
    }

    p.onZipMessage = function (msg) {
        if (msg.type == "complete") {
            var thisFunc = msg.backFunc;
            if (thisFunc) {
                this[thisFunc]();
            }
        }
    }

    //收到整个目录的文件列表信息
    p.receiveDirectionList = function (bytes) {
        var content = bytes.readUTFV();
        if (content == "no") {
            var _this = this;
            setTimeout(this.requestCheckDirection.bind(this), checkGap);
            return;
        }
        var cfg = JSON.parse(content);
        this.clientCfg = cfg;
        var loacalConfigFile = new File(this.root + "file/version.json");
        var localContent = "[]";
        if (loacalConfigFile.isExist()) {
            localContent = loacalConfigFile.readContent();
        }
        var localCfg = JSON.parse(localContent);
        //1. 删除本地有，客户端上没有的文件
        var find;
        for (var i = 0; i < localCfg.length; i++) {
            find = false;
            for (var j = 0; j < cfg.length; j++) {
                if (localCfg[i].url == cfg[j].url) {
                    find = true;
                    break;
                }
            }
            if (!find) {
                var file = new File(this.root + "file/" + localCfg[i].url);
                if (file.isExist()) {
                    file.delete();
                }
            }
        }
        //2. 比对本地没有，或者修改过的文件
        var updateList = [];
        var localFile;
        var url;
        var clientFile;
        for (var j = 0; j < cfg.length; j++) {
            clientFile = cfg[j];
            url = clientFile.url;
            localFile = null;
            for (var i = 0; i < localCfg.length; i++) {
                if (url == localCfg[i].url) {
                    localFile = localCfg[i];
                    break;
                }
            }
            if (!localFile) {
                localFile = {
                    "url": url,
                    "modifyTime": 0,
                    "createTime": 0,
                    "md5": ""
                };
            }
            if (localFile.md5 != clientFile.md5) {
                updateList.push(url);
            }
        }
        this.updateList = updateList;
        //读取update配置
        this.updateConfig = {
            "src": {},
            "res": {index: 1, version: "1.0.1", list: []}
        };
        var file = new File(this.root + "update.json");
        var versionFile = new File(this.root + "update/version.manifest");
        this.firstUpdate = false;
        if (versionFile.isExist() == false) {
            this.firstUpdate = true;
        }
        //if (updateList.length || !versionFile.isExist()) {
        //}
        if (file.isExist()) {
            this.updateConfig = JSON.parse(file.readContent());
        }
        if (!file.isExist()) {
            this.saveManifest();
        }
        if (updateList.length) {
            //删除残留的文件夹 src
            (new File(this.root + "tmpSrc/")).delete();
            //删除残留的文件夹 file/history/{index}/
            file = new File(this.root + "file/history/" + this.updateConfig.res.index);
            file.delete();
            this.updateIndex = 0;
            var msg = new VByteArray();
            msg.writeUIntV(11);
            msg.writeUTFV(this.updateList[this.updateIndex]);
            this.sendData(msg);
        } else {
            this.updateComplete();
        }
    }

    //收到单个文件内容
    p.receiveFileContent = function (bytes) {
        var url = bytes.readUTFV();
        if (url != this.updateList[this.updateIndex]) {
            this.requestCheckDirection();
        } else {
            var start = bytes.readUIntV();
            var end = bytes.readUIntV();
            var contentLen = bytes.readUIntV();
            var len = bytes.readUIntV();
            var list = [];
            for (var i = 0; i < len; i++) {
                list[i] = bytes.readByte();
            }
            if (start == 0) {
                this.fileContent = [];
            }
            this.fileContent = this.fileContent.concat(list);
            if (end == contentLen) {
                var buffer = new Buffer(this.fileContent);
                var file = new File(this.root + "file/" + url);
                file.save(buffer, "binary");
                if (url.split("/")[0] == "src") {
                    file = new File(this.root + "tmpSrc/" + url);
                    file.save(buffer, "binary");
                } else if (url.split("/")[0] == "res") {
                    if (!this.firstUpdate) {
                        file = new File(this.root + "file/history/" + this.updateConfig.res.index + "/" + url);
                        file.save(buffer, "binary");
                    }
                }
                this.updateIndex++;
                if (this.updateIndex < this.updateList.length) {
                    var msg = new VByteArray();
                    msg.writeUIntV(11);
                    msg.writeUTFV(this.updateList[this.updateIndex]);
                    this.sendData(msg);
                } else {
                    this.updateLocal();
                }
            }
        }
    }

    p.updateLocal = function () {
        var srcList = [];
        var resList = [];
        var list = this.updateList;
        var begin;
        for (var i = 0; i < list.length; i++) {
            begin = list[i].split("/")[0];
            if (begin == "src") {
                srcList.push(list[i]);
            }
            if (begin == "res") {
                resList.push(list[i]);
            }
        }
        //console.log("[src list] ",srcList);
        //console.log("[res list] ",resList);
        this.resList = resList;
        this.srcMax = this.updateConfig.src.index;
        this.srcVersion = this.updateConfig.src.version;
        if (srcList.length) {
            new ShellCommand("cocos", ["jscompile", "-s", this.root + "tmpSrc", "-d",
                this.root + "file/jsc"], (function () {
                //写 manifest 和 zip src
                if (!this.srcMax) {
                    this.srcMax = 1000000;
                    this.srcVersion = "10000.0.0";
                } else {
                    this.srcMax++;
                    this.srcVersion = this.addVersion(this.srcVersion);
                }
                this.updateConfig.src.index = this.srcMax;
                this.updateConfig.src.version = this.srcVersion;
                this.zip.send({
                    type: "zip",
                    workDir: this.root + "file/jsc/",
                    zipDir: "./src",
                    toFile: "./../../update/update" + this.srcMax + ".zip",
                    backFunc: "checkResUpdate"
                });
            }).bind(this));
        } else {
            this.checkResUpdate();
        }
    }

    p.checkResUpdate = function () {
        (new File(this.root + "tmpSrc/")).delete();
        if (!this.firstUpdate && this.resList.length) {
            var item = {
                "index": this.updateConfig.res.index,
                "version": this.updateConfig.res.version,
                "files": this.resList
            };
            this.updateConfig.res.list.push(item);
            //压缩最新的 res
            //console.log("send compress");
            this.zip.send({
                type: "zip",
                workDir: this.root + "file/history/" + item.index + "/",
                zipDir: "./res",
                toFile: "./../../../update/update" + item.index + ".zip",
                backFunc: "compressNewestResComplete"
            });
        } else {
            this.updateLocalComplete();
        }
    }


    p.compressNewestResComplete = function () {
        this.checkIndex = this.updateConfig.res.index - 1;
        this.updateConfig.res.index = this.updateConfig.res.index + 1;
        //console.log("compress complete!",this.updateConfig.res.index,this.checkIndex);
        this.updateConfig.res.version = this.addVersion(this.updateConfig.res.version);
        this.checkResHistory();
    }

    /**
     * 检查 res 历史
     */
    p.checkResHistory = function () {
        //console.log("[find check]",this.checkIndex);
        var checkItem = null;
        var checkIndex = null;
        var list = this.updateConfig.res.list;
        for (var i = 0; i < list.length; i++) {
            if (list[i].index == this.checkIndex) {
                checkItem = list[i];
                checkIndex = i;
                break;
            }
        }
        //console.log("[check]",checkIndex,checkItem);
        if (!checkItem) {
            this.updateLocalComplete();
            return;
        }
        var files = checkItem.files;
        var change = false;
        for (var i = 0; i < files.length; i++) {
            for (var j = checkIndex + 1; j < list.length; j++) {
                var checkFiles = list[j].files;
                //console.log("[Compare check]",checkFiles);
                var find = false;
                for (var c = 0; c < checkFiles.length; c++) {
                    if (checkFiles[c] == files[i]) {
                        //删除检查的文件
                        change = true;
                        var deleteFile = new File(this.root + "file/history/" + checkItem.index + "/" + files[i]);
                        deleteFile.delete();
                        files.splice(i, 1);
                        find = true;
                        break;
                    }
                }
                if (find) {
                    i--;
                    break;
                }
            }
        }
        this.checkIndex = -1;
        for (var i = 0; i < list.length; i++) {
            if (list[i].index > this.checkIndex && i < checkIndex) {
                this.checkIndex = list[i].index;
            }
        }
        //console.log("[check end]",checkIndex,"next checkIndex = ",this.checkIndex);
        if (!files.length) {
            list.splice(checkIndex, 1);
            (new File(this.root + "file/history/" + checkItem.index + "/")).delete();
        }
        //if (change && files.length) {
        if (files.length) {
            //压缩最新的 res
            var file = new File(this.root + "update/" + checkItem.index + ".zip");
            file.delete();
            this.zip.send({
                type: "zip",
                workDir: this.root + "file/history/" + checkItem.index + "/",
                zipDir: "./res",
                toFile: "./../../../update/update" + checkItem.index + ".zip",
                backFunc: "checkResHistory"
            });
        } else {
            this.checkResHistory();
        }
    }

    /**
     * 压缩 src 和 res  完毕，开始更新 project.manifest 和 version.manifest
     */
    p.updateLocalComplete = function () {
        this.saveManifest();
        var file = new File(this.root + "update.json");
        file.save(JSON.stringify(this.updateConfig, null, "\t"));
        var file = new File(this.root + "file/version.json");
        file.save(JSON.stringify(this.clientCfg));
        var msg = new VByteArray();
        msg.writeUIntV(13);
        this.sendData(msg);
    }

    p.saveManifest = function () {
        var cfg = this.updateConfig;
        var version = this.versionCfg;
        var project = this.projectCfg;
        var resList = cfg.res.list;
        for (var i = 0; i < resList.length; i++) {
            version.groupVersions[resList[i].index] = resList[i].version;
            project.groupVersions[resList[i].index] = resList[i].version;
            project.assets["update" + resList[i].index] = {
                "path": "update" + resList[i].index + ".zip",
                "md5": "",
                "compressed": true,
                "group": resList[i].index + ""
            }
        }
        if (this.updateConfig.src.index) {
            version.groupVersions[this.updateConfig.src.index] = this.updateConfig.src.version;
            project.groupVersions[this.updateConfig.src.index] = this.updateConfig.src.version;
            project.assets["update" + this.updateConfig.src.index] = {
                "path": "update" + this.updateConfig.src.index + ".zip",
                "md5": "",
                "compressed": true,
                "group": this.updateConfig.src.index + ""
            }
        }
        var file = new File(this.root + "update/version.manifest");
        file.save(JSON.stringify(version, null, "\t"));
        file = new File(this.root + "update/project.manifest");
        file.save(JSON.stringify(project, null, "\t"));
    }

    p.updateComplete = function () {
        //console.log("update complete!!!",this.updateConfig);

        setTimeout(this.requestCheckDirection.bind(this), checkGap);
    }

    /**
     * 增加版本号，比如当前传入 "1.0.0" 返回 "1.0.1" ，如果传入 "1.0.0" 返回 "1.1.0"
     * @param version
     */
    p.addVersion = function (version) {
        var number = 0;
        var res = "";
        var arr = version.split(".");
        var addNext = false;
        for (var i = arr.length - 1; i >= 0; i--) {
            number = parseInt(arr[i]);
            if (i == arr.length - 1) {
                number++;
            } else if (addNext) {
                number++;
            }
            if (i != 0 && number >= 10) {
                number = 0;
                addNext = true;
            } else {
                addNext = false;
            }
            res = number + (i != arr.length - 1 ? "." : "") + res;
        }
        return res;
    }

    //请求客户端检查目录
    p.requestCheckDirection = function () {
        var msg = new VByteArray();
        msg.writeUIntV(9);
        this.sendData(msg);
    }

    p.success = function (cmd) {
        var msg = new VByteArray();
        msg.writeUIntV(0);
        msg.writeUIntV(cmd);
        msg.writeUIntV(0);
        this.sendData(msg);
    }

    p.sendData = function (bytes) {
        if (this.type == "binary") {
            this.connection.sendBytes(new Buffer(bytes.data));
        } else if (this.type == "utf8") {
            var str = "[";
            var array = bytes.data;
            for (var i = 0; i < array.length; i++) {
                str += array[i] + (i < array.length - 1 ? "," : "");
            }
            str += "]";
            this.connection.sendUTF(str);
        }
    }

    p.close = function () {
        this.connection.close();
    }

    //p.onClose = function () {
    //    console.log("链接关闭了 ！");
    //    _super.prototype.onClose.call(this);
    //}

    return FileSyncClient;
})(WebSocketServerClient);


global.FileSyncClient = FileSyncClient;