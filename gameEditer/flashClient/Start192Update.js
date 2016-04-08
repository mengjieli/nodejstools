require("./../../tools/com/requirecom");
require("./../../tools/shell/requireshell");
require("./../../tools/ftp/requireftp");
require("./../../tools/net/requirenet");

var cfg = {
    "url": "https://192.168.1.253/svn/paike/paike_client/ParkerEmpire/",
    "user": "limengjie",
    "password": "lmj111111"
};
var path = require("path");

function getArg(index) {
    if (process.argv.length > index) {
        return process.argv[index];
    }
    return null;
}

var workDir = getArg(2);
var workPath = path.resolve(process.cwd(), workDir);
var thisPath = process.cwd();
process.chdir(workPath);

var svn = new SVNShell(cfg.url, "./svn", cfg.user, cfg.password);
var _this = this;
svn.getReady(function () {
    svn.update(function () {
        console.log("svn update complete :", svn.lastVersion);
        new ShellCommand("node", ["FileSync.js", "./svn/svndir", "localhost", 11000, 192, 1], function () {
            process.send({"type": "complete","message":"Update complete, svn version:" + svn.lastVersion});
            process.chdir(thisPath);
        }, null, function (data) {
            console.log(data);
        });
    });
});