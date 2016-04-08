require("./../../../tools/com/requirecom");
require("./../../../tools/shell/requireshell");
require("./../../../tools/ftp/requireftp");
require("./../../../tools/net/requirenet");

var path = require('path');

process.on('message', function (msg) {
    //console.log("[Thread receive]",msg.type);
    if (msg.type == "zip") {
        var workDir = msg.workDir;
        var zipDir = msg.zipDir;
        var toFile = msg.toFile;
        var backFunc = msg.backFunc;

        var workPath = path.resolve(process.cwd(), workDir);
        var thisPath = process.cwd();
        process.chdir(workPath);
        var file = new File(zipDir);
        var list = file.readDirectionList("*");
        var zipList = [];
        for (var i = 0; i < list.length; i++) {
            zipList.push(list[i].url);
        }
        ZipShell.compress(zipList, toFile, function () {
            process.chdir(thisPath);
            //console.log("[Thread send] complete");
            process.send({"type": "complete", "backFunc": backFunc});
        });
    }
});