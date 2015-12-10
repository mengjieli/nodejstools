require("./../tools/com/requirecom");
require("./../tools/shell/requireshell");
require("./../tools/ftp/requireftp");

new ShellCommand("cocos", ["jscompile", "-s", "./src", "-d", "./out/src"], function () {
});