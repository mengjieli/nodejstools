require("./../tools/com/requirecom");
require("./../tools/shell/requireshell");
require("./../tools/ftp/requireftp");


var files = [
    "history/out-net/update0.zip",
    "history/out-net/update1.zip",
    "history/out-net/update2.zip",
    "history/out-net/update3.zip",
    "history/out-net/update4.zip",
    "history/out-net/update5.zip",
    "history/out-net/update6.zip",
    "history/out-net/update7.zip",
    "history/out-net/update8.zip",
    "history/out-net/update9.zip",
    "history/out-net/update10.zip"
];

var index = 0;
var history = {};
var content = (new File("history/out-net/list.json")).readContent();
var fileInfo = JSON.parse(content);

function UnZip(file) {
    (new File("res/")).delete();
    ZipShell.uncompress(file, function () {
        if (index >= files.length) {
            //console.log(history);
            return;
        }
        var list = new File("res/").readFilesWidthEnd("*");
        history[index] = [];
        var fileList = fileInfo[index + ""];
        for (var i = 0; i < list.length; i++) {
            var find = false;
            for (var j = 0; j < fileList.length; j++) {
                if (fileList[j] == list[i].url) {
                    find = true;
                }
            }
            if (!find) {
                console.log("update" + index, list[i].url);
                list[i].delete();
            } else {
                history[index].push(list[i].url);
            }
        }

        (new File(file)).delete();

        ZipShell.compress("res/", "history/out-net/update" + index + ".zip", function () {
            (new File("res/")).delete();
            index++;
            UnZip(files[index]);
        });
    })
}

UnZip(files[index]);
