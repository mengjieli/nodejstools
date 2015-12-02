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
                ZipShell.compress("src", "tmp/src.zip", function () {
                    (new File("src")).delete();
                    _this.updateRes(server);
                });
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
                if (!_this.currentUpdateSrc && server.res.last == svn.lastVersion) {
                    console.log("  \"src\" and \"res\" is the latest, jump this server update.", server.res.last, svn.lastVersion);
                    _this.updateVersionComplete();
                    return;
                }
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
                var file = new File("res/project.manifest");
                file.save(JSON.stringify(server.resProjectManifest));
                ZipShell.compress("res", "tmp/res.zip", function () {
                    (new File("res")).delete();
                    _this.modifyManifest(server);
                });
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
    var lastVersion = server.version.last;
    var nextVersion = this.addVersion(lastVersion);
    server.version.last = nextVersion;
    this.configString = JSON.stringify(this.config);

    //保存 project.manifest
    var projectManifest = server.projectManifest;
    projectManifest.groupVersions["1"] = nextVersion;
    var list = [];
    for (var key in projectManifest.assets) {
        list.push({
            key: nextVersion + "-" + key.split("-")[1],
            value: projectManifest.assets[key]
        });
        delete projectManifest.assets[key]
    }
    while (list.length) {
        var info = list.shift();
        projectManifest.assets[info.key] = info.value;
    }
    var file = new File("tmp/project.manifest");
    file.save(JSON.stringify(projectManifest));

    //保存 version.manifest
    var versionManifest = server.versionManifest;
    versionManifest.groupVersions["1"] = nextVersion;
    file = new File("tmp/version.manifest");
    file.save(JSON.stringify(versionManifest));

    //上传 ftp
    this.uploadFtp(server, lastVersion, nextVersion);
}

UpdateVersion.prototype.uploadFtp = function (server, lastVersion, nextVersion) {
    var _this = this;
    console.log("  5. upload ftp");
    var ftp = new FTP(server.ftp.ip, server.ftp.user, server.ftp.password);
    ftp.upload("tmp/src.zip", server.ftp.direction + "src.zip", function () {
        ftp.upload("tmp/res.zip", server.ftp.direction + "res.zip", function () {
            ftp.upload("tmp/project.manifest", server.ftp.direction + "project.manifest", function () {
                ftp.upload("tmp/version.manifest", server.ftp.direction + "version.manifest", function () {
                    var file = new File("updateVersion.json");
                    file.save(_this.configString);
                    console.log("  update success, server \"" + server.name + "\"," + lastVersion + "->" + nextVersion);
                    _this.updateVersionComplete();
                })
            })
        })
    })
}

UpdateVersion.prototype.updateVersionComplete = function () {
    (new File("tmp")).delete();
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
    var arr = version.split(".");
    for (var i = arr.length - 1; i >= 0; i--) {
        number += parseInt(arr[i]) * Math.pow(10, arr.length - 1 - i);
    }
    number++;
    var str = number + "";
    var res = "";
    for (var i = 0; i < str.length; i++) {
        res += str.charAt(i) + (i < str.length - 1 ? "." : "");
    }
    return res;
}

new UpdateVersion();