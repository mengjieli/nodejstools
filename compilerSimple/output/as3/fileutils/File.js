/**
 * Created by mengj_000 on 2015/4/23.
 */

var fs = require("fs");
var path = require("path");

function File()
{

}

File.delFile = function(url)
{
    if(fs.existsSync(url))
    {
        fs.unlinkSync(url);
    }
}

File.saveFile = function(url,content)
{
    var arr = url.split(global.filedev);
    var dir = "";
    for(var i = 0; i < arr.length - 1; i++)
        dir += arr[i] + global.filedev;
    if(dir != "")
        File.mkdirs(dir);
    fs.writeFile(url,content,"utf-8");
}

//创建多层文件夹 同步
File.mkdirs = function(dirpath) {
    if (!fs.existsSync(dirpath)) {
        var pathtmp;
        dirpath.split(path.sep).forEach(function(dirname) {
            if (pathtmp) {
                pathtmp = path.join(pathtmp, dirname);
            }
            else {
                pathtmp = dirname;
            }
            if (!fs.existsSync(pathtmp)) {
                if (!fs.mkdirSync(pathtmp, 777)) {
                    return false;
                }
            }
        });
    }
    return true;
}

/*
 File.saveFileBinary = function(url,content)
 {
 var arr = url.split(global.filedev);
 var dir = "";
 for(var i = 0; i < arr.length - 1; i++)
 dir += arr[i] + global.filedev;
 File.mkdirs(dir);
 fs.writeFile(url,content,"utf-8");
 //fs.close();
 }*/

File.isFileExist = function(url)
{
    if(!fs.existsSync(url)) return false;
    return true;
}

File.readUTF8File = function(url)
{
    return fs.readFileSync(url,"utf-8");
}

File.readUTF8FileAnsync = function(url,succes,fail)
{
    fs.readFile(url,"utf-8",function(err,data){
        if(err){
            fail(err);
        }else{
            succes(data);
        }
    });
}

File.readBinaryFileAnsync = function(url,succes,fail)
{
    fs.readFile(url,"binary",function(err,data){
        if(err){
            fail(err);
        }else{
            succes(data);
        }
    });
}

File.saveFileBinaryAnsync = function(url,content,succes,fail,format)
{
    format = format==undefined?"binary":format;
    //if(url.slice(url.length-3,url.length) == "txt" || url.slice(url.length-3,url.length) == "csv") format = "utf-8";
    var arr = url.split(global.filedev);
    var dir = "";
    for(var i = 0; i < arr.length - 1; i++)
        dir += arr[i] + global.filedev;
    if(dir != "")
    {
        mkdirsAn(dir,0777,function(flag){
            if(flag == false)
            {
                console.log("创建文件夹失败:",dir);
            }
            else
            {
                //console.log(url,format);
                fs.writeFile(url, content, format, function(err){
                    if(err){
                        fail();
                    }else{
                        succes();
                    }
                });
            }
            //fs.writeFile(url,content,"utf-8");
        });
    }
}

/**
 * 读取目录下的所有文件，含嵌套目录
 * @param dir
 * @param prefix
 * @returns {*}
 */
File.readDir = function(dir, func)
{
    return readdir(dir).filter(func);
}

global.File = File;

function readdir(dir, prefix) {
    if (prefix === void 0) { prefix = ''; }
    return flatten(fs.readdirSync(dir).map(function (file) {
        var fileName = path.join(prefix, file);
        var filePath = path.join(dir, file);
        return fs.statSync(filePath).isDirectory() ? readdir(filePath, fileName) : fileName;
    }));
}

function flatten(arr) {
    return arr.reduce(function (result, val) {
        if (Array.isArray(val)) {
            result.push.apply(result, flatten(val));
        }
        else {
            result.push(val);
        }
        return result;
    }, []);
}

/**
 * 异步创建文件夹
 * @param dirpath
 * @param mode
 * @param callback
 */
function mkdirsAn(dirpath, mode, callback) {
    callback = callback ||
    function() {};

    fs.exists(dirpath,
        function(exitsmain) {
            if (!exitsmain) {
                //目录不存在
                var pathtmp;
                var pathlist = dirpath.split(path.sep);
                if(pathlist[0] == "") pathlist.shift();
                if(pathlist[pathlist.length-1] == "") pathlist.pop();
                var pathlistlength = pathlist.length;
                var pathlistlengthseed = 0;

                mkdir_auto_next(mode, pathlist, pathlist.length,
                    function(callresult) {
                        if (callresult) {
                            callback(true);
                        }
                        else {
                            callback(false);
                        }
                    });

            }
            else {
                callback(true);
            }

        });
}

// 异步文件夹创建 递归方法
function mkdir_auto_next(mode, pathlist, pathlistlength, callback, pathlistlengthseed, pathtmp) {
    callback = callback ||
    function() {};
    if (pathlistlength > 0) {

        if (!pathlistlengthseed) {
            pathlistlengthseed = 0;
        }

        if (pathlistlengthseed >= pathlistlength) {
            callback(true);
        }
        else {
            if (pathtmp) {
                pathtmp = path.join(pathtmp, pathlist[pathlistlengthseed]);
            }
            else {
                pathtmp = pathlist[pathlistlengthseed];
            }
            if(global.filedev == "/" && pathtmp.charAt(0) != global.filedev) pathtmp = global.filedev + pathtmp;
            fs.exists(pathtmp,
                function(exists) {
                    if (!exists) {
                        fs.mkdir(pathtmp, mode,
                            function(isok) {
                                if (!isok) {
                                    mkdir_auto_next(mode, pathlist, pathlistlength,
                                        function(callresult) {
                                            callback(callresult);
                                        },
                                        pathlistlengthseed + 1, pathtmp);
                                }
                                else {
                                    callback(false);
                                }
                            });
                    }
                    else {
                        mkdir_auto_next(mode, pathlist, pathlistlength,
                            function(callresult) {
                                callback(callresult);
                            },
                            pathlistlengthseed + 1, pathtmp);
                    }
                });

        }

    }
    else {
        callback(true);
    }

}

File.copyNextFile = function()
{
    var item = File.copyNextFile.copyFileList.shift();
    if(item[0] == 1)
    {
        var url = item[1];
        var saveUrl = item[2];
        global.File.readBinaryFileAnsync(url,function(data){
            if(global.Log) global.Log.log(url + " -> " + saveUrl);
            File.saveFileBinaryAnsync(saveUrl,data,function(){
                if(File.copyNextFile.copyFileList.length == 0)
                {
                    if(File.copyNextFile.copyComplete != null) File.copyNextFile.copyComplete();
                }
                else
                {
                    File.copyNextFile();
                }
            },function(){
                console.log("拷贝资源失败：" + url);
            });
        },function(){
            console.log("拷贝资源失败：" + url);
            if(File.copyNextFile.copyFileList.length == 0)
            {
                if(File.copyNextFile.copyComplete != null) File.copyNextFile.copyComplete();
            }
            else
            {
                File.copyNextFile();
            }
        });
    }
    else
    {
        var saveUrl = item[1];
        var data = item[2];
        File.saveFileBinaryAnsync(saveUrl,data,function(){
            if(File.copyNextFile.copyFileList.length == 0)
            {
                if(File.copyNextFile.copyComplete != null) File.copyNextFile.copyComplete();
            }
            else
            {
                File.copyNextFile();
            }
        },function(){
            console.log("保存资源失败：" + url);
        },item.length>3?item[3]:undefined);
    }
}

File.copyNextFile.copyFileList = [];
File.copyNextFile.copyComplete = null;
File.addFileList = function(item)
{
    File.copyNextFile.copyFileList.push(item);
}

File.setFileListComplete = function(func)
{
    File.copyNextFile.copyComplete = func;
}

File.clearFileList = function()
{
    File.copyNextFile.copyFileList = [];
    File.copyNextFile.copyComplete = null;
}