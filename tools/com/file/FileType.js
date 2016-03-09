/**
 * 文件类型
 * @type {{DIRECTION: number, FILE: number}}
 */
var FileType = {
    "DIRECTION": null,
    "NONE": 0
}

File.mkdirsSync("$$$tmpFileType$$$");
FileType.DIRECTION = fs.statSync("$$$tmpFileType$$$").mode;
(new File("$$$tmpFileType$$$")).delete();

global.FileType = FileType;