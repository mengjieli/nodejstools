require("./../tools/com/requirecom");
require("./../tools/shell/requireshell");

var startName = "buildCastle_";
var startIndex = 0;
var maxLength = 2;
var ends = ["png"];
var file = new File("src/");
var fileList = file.readFilesWidthEnd(ends);
(new File("out/")).delete();
for (var i = 0; i < fileList.length; i++) {
    var content = fileList[i].readContent(FileFormat.BINARY);
    var name = (startIndex + i) + "";
    while (name.length < maxLength) {
        name = "0" + name;
    }
    fileList[i].save(content, FileFormat.BINARY, "out/" + startName + name + "." + fileList[i].end);
}