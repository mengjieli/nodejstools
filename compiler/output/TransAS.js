/**
 * Created by mengj_000 on 2015/4/19.
 * 转换单个AS文件
 * 参数node TransSingle.js fileURL
 * fileURL为绝对路径
 * 生成后文件保存在原目录下
 */
require("./requireJs");

//node TransAS.js / 1.0 /Users/mengjieli/Documents/paik/paike_client
//cd /Users/mengjieli/Documents/GameTools/compiler/output

global.filedev = process.argv[2];

var fs = require("fs"),
    path = require("path"),
    File = global.File;

var Log = global.Log;
var As3TransManager = global.As3TransManager;

function doTrans()
{
    global.projcfg = cfg;
    global.projUrl = proj;
    global.projBin = proj + global.filedev + cfg.name;
    var sourceFile = path.resolve(process.cwd(), process.argv[2]);
    var mgr = new As3TransManager();
    mgr.addSourceDirection(cfg.src);
    mgr.addTransTableDirection(cfg.cfg);
    mgr.setBinDir(proj + global.filedev + cfg.name);
    mgr.setStartClass(cfg.start);
    var start = (new Date()).getTime();
    global.Log.clearLog();
    mgr.transformToTS(function(){
        var apiTxt = "";
        for(var i = 0; i < Log.items.length; i++)
        {
            if(Log.items[i].type == 0) continue;
            if(Log.items[i].class == "") console.log(Log.items[i].tip);
            if(Log.items[i].class == "" || Log.items[i].class.slice(0,6) != "flash.") continue;
        }
        console.log("代码转换完毕，耗时" + ((new Date()).getTime() - start)/1000 + "秒");
        global.Log.saveLog(function(){
            File.clearFileList();
            start = (new Date()).getTime();
            var files = File.readDir(cfg.res,function (file) { return true; });
            if(files.length) console.log("开始复制资源文件");
            var bytes;
            var saveurl;
            var startFileName = cfg.start.split(global.filedev)[cfg.start.split(global.filedev).length-1];
            startFileName = startFileName.split(".")[0];
            for(var i = 0; i < files.length; i++)
            {
                if(files[i].slice(files[i].length-3,files[i].length) == "swf" || files[i].slice(files[i].length-3,files[i].length) == "SWF"
                    || files[i].slice(files[i].length-3,files[i].length) == "fla" || files[i].slice(files[i].length-3,files[i].length) == "FLA"
                    || files[i].slice(files[i].length-8,files[i].length) == "DS_Store") continue;
                saveurl = proj + global.filedev + cfg.name + global.filedev + files[i];
                if(saveurl == proj + global.filedev + cfg.name + global.filedev + startFileName + "-app.xml") continue;
                File.addFileList([1,cfg.res + global.filedev + files[i],saveurl]);
                //copyFile(cfg.res + global.filedev + files[i],saveurl);
                /*bytes = File.readBinaryFile(cfg.res + global.filedev + files[i]);
                 global.Log.log(cfg.res + global.filedev + files[i]," -> ",saveurl);
                 File.saveFileBinary(saveurl,bytes);*/
            }
            File.setFileListComplete(function()
            {
                console.log("资源复制完毕，耗时" + ((new Date()).getTime() - start)/1000 + "秒");
            });
            if(File.copyNextFile.copyFileList.length) File.copyNextFile();
        });
    });
}

var version = process.argv[3];
var proj = path.resolve(process.cwd(), process.argv[4]);
var cfg;

File.readBinaryFileAnsync(proj + global.filedev +"conversion.json",function(cfgContent){
	cfg = JSON.parse(cfgContent);
	/*if(version != cfg.version)
	{
	    console.log("发现新的版本" + version + "，更新项目配置...");
	    copyNextFile.copyFileList = [];
	    var projFile = proj;
	    var projName = cfg.name;
	    var content;
	    content = File.readUTF8File("./as3"+ global.filedev + "res" + global.filedev + "LoadingUI.ts");
	    copyNextFile.copyFileList.push([2,projFile + global.filedev + "config" + global.filedev + "LoadingUI.ts",content]);
	    content = File.readUTF8File("./as3" + global.filedev + "res" + global.filedev + "EgretMain.ts");
	    copyNextFile.copyFileList.push([2,projFile + global.filedev + "config" + global.filedev + "EgretMain.ts",content]);
	    copyNextFile.copyFileList.push([2,projFile + global.filedev + projName + global.filedev + "src" + global.filedev + "EgretMain.ts",content]);
	    File.delFile(projFile + global.filedev + projName + global.filedev + "src" + global.filedev + "Main.ts");
	    var files = File.readDir("./as3/res",function (file) { return /.csv/.test(file); });
	    for(var i = 0; i < files.length; i++)
	    {
	        var content = File.readUTF8File("./as3" + global.filedev + "res" + global.filedev + files[i]);
	        copyNextFile.copyFileList.push([2,projFile + global.filedev + "config" + global.filedev + files[i],content]);
	    }
	    files = File.readDir("./as3" + global.filedev + "src",function (file) { return /.ts/.test(file); });
	    for(var i = 0; i < files.length; i++)
	    {
	        content = File.readUTF8File("./as3" + global.filedev + "src" + global.filedev + files[i]);
	        copyNextFile.copyFileList.push([2,projFile + global.filedev + projName + global.filedev + "src" + global.filedev + files[i],content]);
	    }
	    cfg.version = version;
	    copyNextFile.copyFileList.push([2,projFile + global.filedev +"conversion.cts",JSON.stringify(cfg)]);
	    copyNextFile.copyComplete = function()
	    {
	        console.log("项目配置更新完毕");
	        doTrans();
	    };
	    copyNextFile();
	}
	else
	{
	    doTrans();
	}*/
    doTrans();
},function(){
	console.log("读取配置文件失败：" + proj + global.filedev +"conversion.cts");
})




