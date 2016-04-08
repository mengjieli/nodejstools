/**
 * Created by mengj_000 on 2015/4/28.
 */
require("./as3/fileutils/File");

var fs = require("fs"),
    path = require("path"),
    File = global.File;

global.filedev = process.argv[2];
var version = process.argv[3];
var projName = process.argv[4];
var projFile = path.resolve(process.cwd(), process.argv[5]);
var projType =  parseInt(process.argv[6]);
var srcFile,startFile,resFile;
var flexFile;

function readFBConfigFail(err)
{
    console.log("读取FlashBuilder项目配置文件失败，" + err.path);
    console.log("创建转换项目失败，请检查源项目路径是否正确，" + flexFile);
}

function readFBConfigComplete(file)
{
    for(var i = 0; i < file.length; i++)
    {
        if(file.slice(i,i+"sourceFolderPath=\"".length) == "sourceFolderPath=\"")
        {
            for(var j = i+"sourceFolderPath=\"".length; j < file.length; j++)
            {
                if(file.charAt(j) == "\"")
                {
                    srcFile =  flexFile + global.filedev + file.slice(i+"sourceFolderPath=\"".length,j);
                    break;
                }
            }
            break;
        }
    }
    for(var i = 0; i < file.length; i++)
    {
        if(file.slice(i,i+"mainApplicationPath=\"".length) == "mainApplicationPath=\"")
        {
            for(var j = i+"mainApplicationPath=\"".length; j < file.length; j++)
            {
                if(file.charAt(j) == "\"")
                {
                    startFile =  srcFile + global.filedev + file.slice(i+"mainApplicationPath=\"".length,j);
                    break;
                }
            }
            break;
        }
    }
    for(var i = 0; i < file.length; i++)
    {
        if(file.slice(i,i+"outputFolderPath=\"".length) == "outputFolderPath=\"")
        {
            for(var j = i+"outputFolderPath=\"".length; j < file.length; j++)
            {
                if(file.charAt(j) == "\"")
                {
                    resFile =  flexFile + global.filedev + file.slice(i+"outputFolderPath=\"".length,j);
                    break;
                }
            }
            break;
        }
    }
    saveProjectConfig();
}

function readFDConfigFail(err)
{
    console.log("读取FlashDevelop项目配置文件失败：" + err.path);
    console.log("创建转换项目失败，请检查源项目路径是否正确：" + flexFile);
}

function readFDConfigComplete(file)
{
    for(var i = 0; i < file.length; i++)
    {
        if(file.slice(i,i+"class path=\"".length) == "class path=\"")
        {
            for(var j = i+"class path=\"".length; j < file.length; j++)
            {
                if(file.charAt(j) == "\"")
                {
                    srcFile =  flexFile + global.filedev + file.slice(i+"class path=\"".length,j);
                    break;
                }
            }
            break;
        }
    }
    for(var i = 0; i < file.length; i++)
    {
        if(file.slice(i,i+"compile path=\"".length) == "compile path=\"")
        {
            for(var j = i+"compile path=\"".length; j < file.length; j++)
            {
                if(file.charAt(j) == "\"")
                {
                    startFile =  flexFile + global.filedev + file.slice(i+"compile path=\"".length,j);
                    break;
                }
            }
            break;
        }
    }
    resFile =  flexFile + global.filedev + "bin";
    saveProjectConfig();
}

function saveProjectConfig()
{
    var data = {
        "name":projName,
        "src":srcFile,
        "start":startFile,
        "res":resFile,
        "cfg":projFile + global.filedev + "config",
        "version":version
    };
    //保存项目配置
    File.addFileList([2,projFile + global.filedev + "conversion.json",JSON.stringify(data)]);


    //复制转换表配置
    var files = File.readDir("./as3" + global.filedev + "res",function (file) { return /.csv/.test(file); });
    for(var i = 0; i < files.length; i++)
    {
        File.addFileList([1,"./as3" + global.filedev + "res" + global.filedev + files[i],projFile + global.filedev + "config" + global.filedev + files[i]]);
    }
    ////复制LoadingUI文件
    //File.addFileList([1,"./as3" + global.filedev + "res" + global.filedev + "LoadingUI.ts",projFile + global.filedev + projName + global.filedev + "src" + global.filedev + "LoadingUI.ts"]);
    ////复制启动文件
    //File.addFileList([1,"./as3" + global.filedev + "res" + global.filedev + "EgretMain.ts",projFile + global.filedev + "config" + global.filedev + "EgretMain.ts"]);
    ////复制启动文件
    //File.addFileList([1,"./as3" + global.filedev + "res" + global.filedev + "EgretMain.ts",projFile + global.filedev + projName + global.filedev + "src" + global.filedev + "EgretMain.ts"]);
    ////删除原有的配置文件
    //File.delFile(projFile + global.filedev + projName + global.filedev +"src" + global.filedev + "Main.ts");
    //
    //files = File.readDir("./as3" + global.filedev + "src",function (file) { return /.ts/.test(file); });
    ////复制as3的ts类库
    //for(var i = 0; i < files.length; i++)
    //{
    //    File.addFileList([1,"./as3" + global.filedev + "src" + global.filedev + files[i],projFile + global.filedev + data.name + global.filedev + "src" + global.filedev + files[i]]);
    //}

    File.copyNextFile();
    //读取egret项目配置，修改启动入口
    //File.readUTF8FileAnsync(projFile + global.filedev + projName + global.filedev + "egretProperties.json",function(content){
    //    var token = "\"document_class\":";
    //    for(i = 0; i < content.length; i++)
    //    {
    //        if(content.slice(i,i+token.length) == token)
    //        {
    //            for(var p = i+token.length; p < content.length; p++)
    //            {
    //                if (content.charAt(p) == ",")
    //                {
    //                    content = content.slice(0,i) + token + "\"EgretMain\"" + content.slice(p,content.length);
    //                    break;
    //                }
    //            }
    //            break;
    //        }
    //    }
    //    File.addFileList([2,projFile + global.filedev + projName + global.filedev + "egretProperties.json",content,"utf-8"]);
    //    File.setFileListComplete(function()
    //    {
    //        console.log("创建转换项目完毕");
    //    });
    //    File.copyNextFile();
    //},function(err){
    //    console.log("读取Egret项目配置文件失败，" + err.path);
    //});
}

if(projType == 1)
{
    flexFile = path.resolve(process.cwd(), process.argv[7]);
    File.readUTF8FileAnsync(flexFile + global.filedev + ".actionScriptProperties",readFBConfigComplete,readFBConfigFail);
}
else if(projType == 2)
{
    flexFile = path.resolve(process.cwd(), process.argv[7]);
    var files = File.readDir(flexFile,function (file) { return /.as3proj/.test(file); });
    File.readUTF8FileAnsync(flexFile + "/" + files[0],readFDConfigComplete,readFDConfigFail);
}
else if(projType == 3)
{
    srcFile = path.resolve(process.cwd(), process.argv[7]);
    startFile = path.resolve(process.cwd(), process.argv[8]);
    resFile = path.resolve(process.cwd(), process.argv[9]);
    saveProjectConfig();
}