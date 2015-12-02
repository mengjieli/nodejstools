var ZipShell = function () {

}

/**
 * 打 zip 包
 * @param files 源文件数组
 * @param outzip 输出的 zip 地址
 * @param complete
 * @param thisObj
 */
ZipShell.compress = function (files, outzip, complete, thisObj) {
    var args = ["-r", outzip];
    args = args.concat(files);
    new ShellCommand("zip", args, function () {
        if (complete) {
            complete.apply(thisObj);
        }
    });
}

global.ZipShell = ZipShell;var ZipShell = function () {

}

/**
 * 打 zip 包
 * @param files 源文件数组
 * @param outzip 输出的 zip 地址
 * @param complete
 * @param thisObj
 */
ZipShell.compress = function (files, outzip, complete, thisObj) {
    var args = ["-r", outzip];
    args = args.concat(files);
    new ShellCommand("zip", args, function () {
        if (complete) {
            complete.apply(thisObj);
        }
    });
}

global.ZipShell = ZipShell;