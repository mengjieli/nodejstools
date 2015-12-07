require("./../tools/com/requirecom");
require("./../tools/shell/requireshell");
require("./../tools/ftp/requireftp");

new ShellCommand("cocos", ["jscompile", "-s", "./script 2", "-d", "./script/"], function () {
});