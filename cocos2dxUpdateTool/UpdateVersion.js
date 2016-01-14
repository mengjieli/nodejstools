require("./../tools/com/requirecom");
require("./../tools/shell/requireshell");
require("./../tools/ftp/requireftp");

var UpdateVersion = function (workFile, updateComplete, thisObj) {

    this.workFile = workFile;
    this.updateComplete = updateComplete;
    this.updateCompleteThis = thisObj;

    this.localsrc = this.workFile + "svnsrc";
    this.localres = this.workFile + "svnres";

    this.log = "";

    var file = new File(this.workFile + "updateVersion.json");
    var content = file.readContent();
    var config = JSON.parse(content);
    this.config = config;
    this.serverList = config.list;

    this.updateIndex = 0;
    this.updateVersion();
}

/**
 * 更新版本信息并上传到 ftp 服务器
 */
UpdateVersion.prototype.updateVersion = function () {
    var server = this.serverList[this.updateIndex];
    if (server.flag == false) {
        this.addLog("jump server update " + server.name + ".\n");
        this.addLog("\n");
        setTimeout(this.updateVersionComplete.bind(this), 1000);
        return;
    }
    this.addLog("ready to update server \"" + server.name + "\":\n");
    this.currentUpdateSrc = true; // src svn 有版本更新
    this.currentUpdateRes = true; // res svn 有版本更新
    this.updateSrc(server);
}

/**
 * 更新 src
 * @param server
 */
UpdateVersion.prototype.updateSrc = function (server) {
    this.addLog("  1. update \"src\" from svn\n");
    (new File("src")).delete();
    var svn = new SVNShell(server.svn.url + "src", this.localsrc, server.svn.user, server.svn.password);
    var _this = this;
    svn.getReady(function () {
        svn.update(function () {
            _this.currentUpdateSrc = server.src.last == svn.lastVersion ? false : true;
            server.src.last = svn.lastVersion;
            //jsc 工具
            _this.addLog("  2. jsc \"src\"\n");
            new ShellCommand("cocos", ["jscompile", "-s", svn.localsvndir, "-d", "src/"], function () {
                _this.updateRes(server);
            });
        });
    });
}

/**
 * 更新 res
 * @param server
 */
UpdateVersion.prototype.updateRes = function (server) {
    this.addLog("  3. update \"res\" from svn\n");
    (new File("res")).delete();
    var svn = new SVNShell(server.svn.url + "res", this.localres, server.svn.user, server.svn.password);
    var _this = this;
    svn.getReady(function () {
        svn.update(function () {
            svn.checkVersionDifference(server.res.last, svn.lastVersion, function (list) {
                server.res.last = svn.lastVersion;
                var hasFile = false;
                for (var i = 0; i < list.length; i++) {
                    if (list[i].type == SVNDifferenceType.ADD || list[i].type == SVNDifferenceType.MODIFY) {
                        var fileName = list[i].url.split("/")[list[i].url.split("/").length - 1];
                        if (fileName.split(".").length == 1) continue;
                        var file = new File(list[i].url);
                        var content = file.readContent("binary");
                        file.save(content, "binary", "res/" + list[i].relativeurl);
                        hasFile = true;
                    }
                }
                _this.currentUpdateRes = hasFile;
                if (!_this.currentUpdateSrc && !_this.currentUpdateRes) {
                    _this.addLog("  \"src\" and \"res\" is the latest, jump this server update." + server.res.last + "," + svn.lastVersion + "\n");
                    _this.updateVersionComplete();
                    return;
                }
                _this.modifyManifest(server);
            });
        });
    });
}

/**
 * 修改 manifest
 * @param server
 */
UpdateVersion.prototype.modifyManifest = function (server) {
    this.addLog("  4. modify manifest files\n");
    var srcMax = server.version.src.key;
    var srcVersion = server.version.src.version;
    var resLastVersion = "";
    var resMax = 0;
    var resNextVersion = "";
    if (this.currentUpdateSrc) {
        if (!srcMax) {
            srcMax = 1000000;
            srcVersion = "10000.0.0";
        } else {
            srcMax++;
            srcVersion = this.addVersion(srcVersion);
        }
        server.version.src.key = srcMax;
        server.version.src.version = srcVersion;
    }
    if (this.currentUpdateRes) {
        for (var key in server.version.res) {
            resMax = parseInt(key) > resMax ? parseInt(key) : resMax;
        }
        var resLastVersion = server.version.res[resMax + ""];
        if (!resLastVersion) resLastVersion = "1.0.0";
        resNextVersion = this.addVersion(resLastVersion);
        resMax++;
        server.version.res[resMax + ""] = resNextVersion;
        server.version.svn[resMax + ""] = server.res.last;
        this.addLog("     res version : " + resNextVersion + " \n");
    }

    //保存 project.manifest
    var projectManifest = ObjectDo.deepClone(server.projectManifest);
    for (var key in server.version.res) {
        projectManifest.groupVersions[key] = server.version.res[key];
        projectManifest.assets["update" + key] = {
            "path": "update" + key + ".zip",
            "md5": "",
            "compressed": true,
            "group": key
        }
    }
    if (this.currentUpdateSrc) {
        projectManifest.groupVersions[srcMax + ""] = srcVersion;
        projectManifest.assets["update" + srcMax] = {
            "path": "update" + srcMax + ".zip",
            "md5": "",
            "compressed": true,
            "group": srcMax + ""
        }
    }

    //保存 version.manifest
    var versionManifest = ObjectDo.deepClone(server.versionManifest);
    for (var key in server.version.res) {
        versionManifest.groupVersions[key] = server.version.res[key];
    }
    if (this.currentUpdateSrc) {
        this.addLog("     src version : " + srcVersion + " \n");
        versionManifest.groupVersions[srcMax + ""] = srcVersion;
    }

    if (Object.keys(server.version.res).length == 0) {
        var file = new File("res/project.manifest");
        file.save(JSON.stringify(server.resProjectManifest));
    }

    var _this = this;
    ZipShell.compress(["src/"], "update" + srcMax + ".zip", function () {
        if (_this.currentUpdateRes) {
            ZipShell.compress(["res"], "update" + resMax + ".zip", function () {
                ZipShell.compress(["res"], _this.workFile + "history/" + server.name + "/update" + resMax + ".zip", function () {
                    _this.compareHistory(server, resMax, srcMax, versionManifest, projectManifest);
                });
            });
        } else {
            _this.compareHistory(server, resMax, srcMax, versionManifest, projectManifest);
        }
    });
}

UpdateVersion.prototype.compareHistory = function (server, resMax, srcMax, versionManifest, projectManifest) {
    this.addLog("  5. compare history files\n");
    var historyFile = new File(this.workFile + "history/" + server.name + "/list.json");
    if (historyFile.isExist() == false) {
        historyFile.save("{}");
    }
    var history = JSON.parse(historyFile.readContent());
    if (this.currentUpdateRes) {
        var currentList = (new File("res/")).readFilesWidthEnd("*");
        history[resMax + ""] = [];
        for (var i = 0; i < currentList.length; i++) {
            history[resMax + ""].push(currentList[i].url);
        }
    }

    var delList = {};
    var min = null;
    var check = {};
    while (true) {
        var findMin = false;
        min = null;
        for (var key in history) {
            if (!check[parseInt(key)] && (min == null || min > parseInt(key))) {
                min = parseInt(key);
                findMin = true;
            }
        }
        if (!findMin) {
            break;
        }
        check[min] = true;
        delList[min] = {};
        var list = history[min + ""];
        for (var key in history) {
            if (parseInt(key) > min) {
                var compareList = history[key];
                for (var i = 0; i < list.length; i++) {
                    if (delList[min][i]) {
                        continue;
                    }
                    for (var j = 0; j < compareList.length; j++) {
                        if (list[i] == compareList[j]) {
                            delList[min][i] = list[i];
                            break;
                        }
                    }
                }
            }
        }
    }

    var _this = this;

    var keys = Object.keys(delList);
    var keyIndex = 0;
    var subList = null;
    var ftp = new FTP(server.ftp.ip, server.ftp.user, server.ftp.password);

    var checkDelList = function () {
        if (keyIndex >= keys.length) {
            var file = new File("tmp/project.manifest");
            file.save(JSON.stringify(projectManifest));

            file = new File("tmp/version.manifest");
            file.save(JSON.stringify(versionManifest));

            (new File(_this.workFile + "history/" + server.name + "/list.json")).save(JSON.stringify(history));
            console.log("upload file",server,resMax,srcMax);
            _this.uploadFtp(server, resMax, srcMax, ftp);
            return;
        }
        subList = delList[keys[keyIndex]];
        var historyList = history[keys[keyIndex]];
        (new File("res/")).delete();
        var zipFile = new File(_this.workFile + "history/" + server.name + "/update" + keys[keyIndex] + ".zip");
        if (zipFile.isExist()) {
            //解压缩 update*.zip 到 res/ 目录
            ZipShell.uncompress(zipFile.url, function () {
                for (var subKey in subList) {
                    (new File(subList[subKey])).delete();
                    for (var f = 0; f < historyList.length; f++) {
                        if (historyList[f] == subList[subKey]) {
                            historyList.splice(f, 1);
                            break;
                        }
                    }
                }
                zipFile.delete();
                if (!historyList.length) {
                    delete history[keys[keyIndex]];
                    delete server.version.res[keys[keyIndex]];
                    delete server.version.res[keys[keyIndex]];
                    delete versionManifest.groupVersions[keys[keyIndex]];
                    delete versionManifest.groupVersions[keys[keyIndex]];
                    delete projectManifest.assets["update" + keys[keyIndex]];
                    keys.splice(keyIndex, 1);
                    checkDelList();
                } else {
                    ZipShell.compress("res/", zipFile.url, function () {
                        console.log(keys.length,keyIndex,keys[keyIndex]);
                        ftp.upload(zipFile.url, server.ftp.direction + "update" + keys[keyIndex] + ".zip", function () {
                            keyIndex++;
                            checkDelList();
                        });
                    });
                }
            })
        } else {
            delete history[keys[keyIndex]];
            delete server.version.res[keys[keyIndex]];
            delete server.version.res[keys[keyIndex]];
            delete versionManifest.groupVersions[keys[keyIndex]];
            delete versionManifest.groupVersions[keys[keyIndex]];
            delete projectManifest.assets["update" + keys[keyIndex]];
            keys.splice(keyIndex, 1);
            checkDelList();
        }
    }
    checkDelList();
}

UpdateVersion.prototype.uploadFtp = function (server, resMax, srcMax, ftp) {
    this.addLog("  6. upload ftp \n");
    var _this = this;
    var uploadComplete = function () {
        var file = new File(_this.workFile + "updateVersion.json");
        file.save(JSON.stringify(_this.config));
        _this.addLog("  update success, server \"" + server.name + "\n");
        _this.updateVersionComplete();
    }
    ftp.upload("tmp/project.manifest", server.ftp.direction + "project.manifest", function () {
        ftp.upload("tmp/version.manifest", server.ftp.direction + "version.manifest", function () {
            if (_this.currentUpdateSrc && _this.currentUpdateRes) {
                ftp.upload("update" + srcMax + ".zip", server.ftp.direction + "update" + srcMax + ".zip", function () {
                    (new File("update" + srcMax + ".zip")).delete();
                    ftp.upload("update" + resMax + ".zip", server.ftp.direction + "update" + resMax + ".zip", function () {
                        (new File("update" + resMax + ".zip")).delete();
                        uploadComplete();
                    })
                })
            }
            else if (_this.currentUpdateSrc) {
                ftp.upload("update" + srcMax + ".zip", server.ftp.direction + "update" + srcMax + ".zip", function () {
                    (new File("update" + srcMax + ".zip")).delete();
                    uploadComplete();
                })
            }
            else if (_this.currentUpdateRes) {
                ftp.upload("update" + resMax + ".zip", server.ftp.direction + "update" + resMax + ".zip", function () {
                    (new File("update" + resMax + ".zip")).delete();
                    uploadComplete();
                })
            }
        })
    });
}

UpdateVersion.prototype.updateVersionComplete = function () {
    (new File("src")).delete();
    (new File("res")).delete();
    (new File("tmp")).delete();
    this.updateIndex++;
    if (this.updateIndex < this.serverList.length) {
        this.updateVersion();
    } else {
        if (this.updateComplete) {
            this.updateComplete.apply(this.updateCompleteThis);
        }
    }
}

UpdateVersion.prototype.addLog = function (log) {
    console.log(log);
    this.log += log;
}

/**
 * 增加版本号，比如当前传入 "1.0.0" 返回 "1.0.1" ，如果传入 "1.0.0" 返回 "1.1.0"
 * @param version
 */
UpdateVersion.prototype.addVersion = function (version) {
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

global.UpdateVersion = UpdateVersion;