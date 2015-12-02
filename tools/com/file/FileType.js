/**
 * 文件类型
 * @type {{DIRECTION: number, FILE: number}}
 */
var FileType = {
    "DIRECTION": global.System.platform == global.System.WINDOWS ? 16822 : 16877,
    "FILE": global.System.platform == global.System.WINDOWS ? 33206 : 33188,
    "NONE": 0
}

global.FileType = FileType;