require("./../tools/com/requirecom");
require("./../tools/shell/requireshell");
require("./../tools/ftp/requireftp");

var UpdateVersion = function () {

    this.localsrc = "svnsrc";
    this.localres = "svnres"

    var file = new File("updateVersion.json");
    var content = file.readContent();
    var config = JSON.parse(content);
    this.config = config;
    this.configString = "";
    this.serverList = config.list;

    this.updateIndex = 0;
    this.updateVersion();
}

/**
 * 更新版本信息并上传到 ftp 服务器
 */
UpdateVersion.prototype.updateVersion = function () {
    var server = this.serverList[this.updateIndex];
    console.log("ready to update server \"" + server.name + "\":");
    this.currentUpdateSrc = true; // src svn 有版本更新
    this.currentUpdateRes = true; // res svn 有版本更新
    this.updateSrc(server);
}

/**
 * 更新 src
 * @param server
 */
UpdateVersion.prototype.updateSrc = function (server) {
    console.log("  1. update \"src\" from svn");
    (new File("src")).delete();
    var svn = new SVNShell(server.svn.url + "src", this.localsrc, server.svn.user, server.svn.password);
    var _this = this;
    svn.getReady(function () {
        svn.update(function () {
            _this.currentUpdateSrc = server.src.last == svn.lastVersion ? false : true;
            server.src.last = svn.lastVersion;
            //jsc 工具
            console.log("  2. jsc \"src\"");
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
    console.log("  3. update \"res\" from svn");
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
                        var file = new File(list[i].url);
                        var content = file.readContent("binary");
                        file.save(content, "binary", "res/" + list[i].relativeurl);
                        hasFile = true;
                    }
                }
                _this.currentUpdateRes = hasFile;
                if (!_this.currentUpdateSrc && !_this.currentUpdateRes) {
                    console.log("  \"src\" and \"res\" is the latest, jump this server update.", server.res.last, svn.lastVersion);
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
    console.log("  4. modify manifest files");
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
    }
    this.configString = JSON.stringify(this.config);


    //保存 project.manifest
    var projectManifest = server.projectManifest;
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
    var file = new File("tmp/project.manifest");
    file.save(JSON.stringify(projectManifest));

    //保存 version.manifest
    var versionManifest = server.versionManifest;
    for (var key in server.version.res) {
        versionManifest.groupVersions[key] = server.version.res[key];
    }
    if (this.currentUpdateSrc) {
        versionManifest.groupVersions[srcMax + ""] = srcVersion;
    }
    file = new File("tmp/version.manifest");
    file.save(JSON.stringify(versionManifest));


    var _this = this;
    var file = new File("res/project.manifest");
    file.save(JSON.stringify(server.resProjectManifest));
    ZipShell.compress(["src"], "tmp/update" + srcMax + ".zip", function () {
        if (_this.currentUpdateRes) {
            ZipShell.compress(["res"], "tmp/update" + resMax + ".zip", function () {
                //上传 ftp
                _this.uploadFtp(server, resMax, srcMax);
            });
        } else {
            //上传 ftp
            _this.uploadFtp(server, resMax, srcMax);
        }
    });
}

UpdateVersion.prototype.uploadFtp = function (server, resMax, srcMax) {
    console.log("  5. upload ftp ");
    var _this = this;
    var ftp = new FTP(server.ftp.ip, server.ftp.user, server.ftp.password);
    var uploadComplete = function () {
        var file = new File("updateVersion.json");
        file.save(_this.configString);
        console.log("  update success, server \"" + server.name);
        _this.updateVersionComplete();
    }
    ftp.upload("tmp/project.manifest", server.ftp.direction + "project.manifest", function () {
        ftp.upload("tmp/version.manifest", server.ftp.direction + "version.manifest", function () {
            if (_this.currentUpdateSrc && _this.currentUpdateRes) {
                ftp.upload("tmp/update" + srcMax + ".zip", server.ftp.direction + "update" + srcMax + ".zip", function () {
                    ftp.upload("tmp/update" + resMax + ".zip", server.ftp.direction + "update" + resMax + ".zip", function () {
                        uploadComplete();
                    })
                })
            }
            else if (_this.currentUpdateSrc) {
                ftp.upload("tmp/update" + srcMax + ".zip", server.ftp.direction + "update" + srcMax + ".zip", function () {
                    uploadComplete();
                })
            }
            else if (_this.currentUpdateRes) {
                ftp.upload("tmp/update" + resMax + ".zip", server.ftp.direction + "update" + resMax + ".zip", function () {
                    uploadComplete();
                })
            }
        })
    });
}

UpdateVersion.prototype.updateVersionComplete = function () {
    (new File("src")).delete();
    (new File("res")).delete();
    //(new File("tmp")).delete();
    this.updateIndex++;
    if (this.updateIndex < this.serverList.length) {
        this.updateVersion();
    }
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

new UpdateVersion();