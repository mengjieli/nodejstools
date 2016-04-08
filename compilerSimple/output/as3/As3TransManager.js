/**
 * Created by mengj_000 on 2015/4/23.
 */


var As3TransTable = global.As3TransTable;
var File = global.File;
var Parser = global.Parser;
var Scanner = global.Scanner;
var As3File = global.As3File;
var ClassData = global.ClassData;
var FunctionData = global.FunctionData;
var Log = global.Log;

global.ExtendClass = [];

/**
 * 包只取头和尾
 * @type {boolean}
 */
global.packageCut = true;

function As3TransManager()
{
    //as3代码目录
    this.asdir = "";
    //as代码文件
    this.asfiles = [];
    //转换表路径
    this.tabledir = "";
    //输出目录
    this.bindir = "";
    //转换表
    this.transTable = new As3TransTable();
    //所有的类表
    this.class = {};
    //所有的包前缀
    this.classbegin = {};
    //所有的as类
    this.files = [];
    //启动类
    this.startFile = "";
    this.startClassName = "";
}


/**
 * 设置输出目录
 * @param dir
 */
As3TransManager.prototype.setBinDir = function(dir)
{
    if(dir.charAt(dir.length-1) != global.filedev) dir += global.filedev;
    this.bindir = dir;
}

/**
 * 设置启动类
 * @param mainurl
 */
As3TransManager.prototype.setStartClass = function(startFile)
{
    this.startFile = startFile;
}

/**
 * 添加源代码路径
 * @param dir
 */
As3TransManager.prototype.addSourceDirection = function(dir)
{
    if(dir.charAt(dir.length-1) != global.filedev) dir += global.filedev;
    this.asdir = dir;
    var files = File.readDir(dir,function (file) { return /.as$/.test(file); });
    this.asfiles = files;
}

/**
 * 添加转换表路径
 * @param url
 */
As3TransManager.prototype.addTransTableDirection = function(dir)
{
    this.tabledir = dir;
    var files = File.readDir(dir,function (file) { return /.csv$/.test(file); });
    var file;
    var lines;
    var line;
    var arr;
    var item;
    for(var i = 0; i < files.length; i++)
    {
        file = File.readUTF8File(dir + global.filedev + files[i]);
        lines = file.split("\r\n");
        lines.splice(0,2);
        for(var l = 0; l < lines.length; l++)
        {
            line = lines[l];
            arr = line.split(",");
            if(arr.length < 14) continue;
            this.transTable.fillItemByArray(arr);
        }
    }
}

As3TransManager.prototype.getClassData = function()
{
    var datas = this.transTable.getClassData();
    for(var i = 0; i < datas.length; i++)
    {
        if(datas[i].maintype == "class")
        {
            var cd = ClassData.createClassData(datas[i]);
            if(this.class[cd.name] == undefined)
            {
                this.class[cd.name] = {"class":null,"function":null};
                for(var c = 0; c < cd.name.length; c++)
                {
                    if(cd.name.charAt(c) == ".")
                    {
                        this.classbegin[cd.name.slice(0,c)] = true;
                    }
                }
            }
            this.class[cd.name].class = cd;
        }
        else if(datas[i].maintype == "function")
        {
            var fc = new FunctionData(datas[i].public,datas[i].static,datas[i].name,datas[i].type);
            if(this.class[fc.name] == undefined)
            {
                this.class[fc.name] = {"class":null,"function":null};
                for(var c = 0; c < fc.name.length; c++)
                {
                    if(fc.name.charAt(c) == ".")
                    {
                        this.classbegin[fc.name.slice(0,c)] = true;
                    }
                }
            }
            this.class[fc.name].function = fc;
        }
    }
    //for(var key in this.class)
    //{
    //    console.log(key,":","class=",this.class[key].class?true:false,"function=",this.class[key].function?true:false);
    //}
}

As3TransManager.prototype.transformToTS = function(completeBack)
{
    File.clearFileList();

    this.getClassData();

    var scanner = new Scanner();
    var common = {"ids":{},"tokenValue":null,"scanner":scanner,"nodeStack":null};
    scanner.setCommonInfo(common);
    var parser = new Parser();
    parser.setCommonInfo(common);

    var width = 640;
    var height = 800;

    var files = this.asfiles;
    var fileURL = "";
    var fileContent;
    for(var i = 0; i < files.length; i++)
    {
        //console.log("转换文件,",files[i],"  ",Math.floor(1000*(i/files.length))/100,"%");
        //console.log(files[i].split(".")[0].split("\\")[files[i].split(".")[0].split("\\").length-1],Math.floor(1000*(i/files.length))/10,"%");
        fileContent = File.readUTF8File(this.asdir + files[i]);
        global.Statistics.addFile(files[i],fileContent);
        var start = 0;
        var ch;
        while(true)
        {
            ch = fileContent.charCodeAt(start);
            if(ch > 128)
            {
                start++;
            }
            else
            {
                break;
            }
        }
        if(start)
        {
            fileContent = fileContent.slice(start,fileContent.length);
        }
        if(fileContent != "")
        {
            common.ids = {};
            common.tokenValue = null;
            common.nodeStack = null;
            common.url = files[i];
            common.file = new As3File(files[i]); //,"package":"","imports":[],"members":[]
            global.Log.log("解析文件 " + files[i]);
            common.file.contentLength = fileContent.length;
            if(parser.transformToTS(fileContent) == false)
            {
                global.Statistics.addFailFile(files[i]);
                continue;
            }
            if(this.asdir + files[i] == this.startFile)
            {
                common.file.setStart();
                this.startClassName = common.file.package.class.name;
            }
            this.files.push({"file":common.file,"url":files[i].split(".")[0]});
            if(common.file.swfTag)
            {
                if(common.file.swfTag.width) width = common.file.swfTag.width;
                if(common.file.swfTag.height) height = common.file.swfTag.height;
            }

            var names = common.file.getClassNames();
            for(var c = 0; c < names.length; c++)
            {
                this.class[names[c]] = {"class":null,"function":null};
                var namestr = names[c];
                if(namestr)
                {
                    for(var cc = 0; cc < namestr.length; cc++)
                    {
                        if(namestr.charAt(cc) == ".")
                        {
                            this.classbegin[namestr.slice(0,cc)] = true;
                        }
                    }
                }
            }
        }
    }

    for(i = 0; i < this.files.length; i++)
    {
        var cds = this.files[i].file.getClassData(this.class);
        for(var c = 0; c < cds.length; c++)
        {
            var cd = ClassData.createClassData(cds[c],cds[c].internal);
            this.class[cd.name].class = cd;
        }
    }


    //分析所有类的继承关系
    var cls;
    var list;
    var checkClass;
    while(true)
    {
        checkClass = null;
        for(i in this.class)
        {
            if(this.class[i].class == null) continue;
            cls = this.class[i].class;
            list = [];
            while(cls)
            {
                list.push(cls);
                if(this.class[cls.extendClassName] == undefined) cls = null;
                else cls = this.class[cls.extendClassName].class;
            }
            for(var c = list.length-1; c >= 0; c--)
            {
                if(list[c].check == false)
                {
                    checkClass = list[c];
                    break;
                }
            }
            if(checkClass) break;
        }
        if(checkClass)
        {
            if(checkClass.name == "Object")
            {
                checkClass.check = true;
            }
            else
            {
                if(checkClass.extendClassName == "")
                {
                    checkClass.extendClass(this.class["Object"].class);
                }
                else
                {
                    //console.log(checkClass.name," ->继承-> ",checkClass.extendClassName);
                    if(this.class[checkClass.extendClassName] != undefined && this.class[checkClass.extendClassName].class != null)
                        checkClass.extendClass(this.class[checkClass.extendClassName].class);
                }
                checkClass.check = true;
            }
        }
        else
        {
            break;
        }
    }


    //分析每个类文件
    var embeds = [];
    for(i = 0; i < this.files.length; i++)
    {
        //console.log("转换",this.files[i].file.package.class.allName);
        global.Log.log("生成文件 " + this.files[i].url + ".ts");
        var content = this.files[i].file.printTS(this,embeds);
        var url = this.files[i].file.package.packageURL;
        if(url.split(".").length > 1)
        {
            var arr = url.split(".");
            url = "";
            for(var a = 0;a < arr.length; a++)
            {
                url += arr[a] + global.filedev;
            }
        }
        else
        {
            if(url.length) url += global.filedev;
        }
        url += this.files[i].file.package.class.name + ".ts";
        //this.files[i].url + ".ts";//"src/" + (common.class.package==""?"":common.class.package+"/") + common.class.name + ".ts";
        //console.log("保存目录：",this.bindir + url);
        File.addFileList([2,this.bindir + "srcts" + global.filedev + url,content,"utf-8"]);
        //console.log(this.class[this.files[i].file.package.class.allName]);
    }

    //生存类继承关系数组
    var list = global.ExtendClass;
    File.saveFile(this.bindir + global.filedev + "srcts" + global.filedev + "extend.json",JSON.stringify(list));

    //生成启动类Main.ts
    /*
     /**
     * 进入主程序
    private startApplication():void
    {
        this.addChild(new TestTrans());
    }

    var embedLoadingList = ["resource/assets/tree.png","resource/assets/test.jpg"];
     */

    //var mainFile = File.readUTF8File(this.tabledir + global.filedev + "EgretMain.ts");
    //mainFile += "\r\n\r\n\t/**\r\n";
    //mainFile += "\t* 进入主程序\r\n";
    //mainFile += "\t*/\r\n";
    //mainFile += "\tprivate onConfigComplete(event: RES.ResourceEvent): void \r\n";
    //mainFile += "\t{\r\n";
    //mainFile += "\t\tthis.addChild(new " + this.startClassName + "());\r\n";
    //mainFile += "\t}\r\n";
    //mainFile += "}\r\n";
    //mainFile += "\r\n";
    //
    //mainFile += "var embedLoadingList = [";
    //var ebs = {};
    //for(var i = 0; i < embeds.length; i++)
    //{
    //    if(ebs[embeds[i]] != undefined) continue;
    //    ebs[embeds[i]] = true;
    //    mainFile += "\"" + embeds[i] + "\"" + (i<embeds.length-1?",":"");
    //}
    //mainFile += "];\r\n";
    ////File.saveFile(this.bindir + global.filedev + "src" + global.filedev + "EgretMain.ts",mainFile);
    //File.addFileList([2,this.bindir + global.filedev + "src" + global.filedev + "EgretMain.ts",mainFile,"utf-8"]);
    //
    ////mainFile = File.readUTF8File(this.tabledir + global.filedev + "LoadingUI.ts");
    ////File.saveFile(this.bindir + global.filedev + "src" + global.filedev + "LoadingUI.ts",mainFile);
    ////File.addFileList([2,this.bindir + global.filedev + "src" + global.filedev + "EgretMain.ts",mainFile]);

    try{
        content = File.readUTF8File(this.bindir + global.filedev + "launcher" + global.filedev + "egret_loader.js");
        var token = "egret.StageDelegate.getInstance().setDesignSize";
        for(i = 0; i < content.length; i++)
        {
            if(content.slice(i,i+token.length) == token)
            {
                for(var p = i+token.length; p < content.length; p++)
                {
                    if (content.charAt(p) == ")")
                    {
                        content = content.slice(0,i) + token + "(" + width + "," + height + content.slice(p,content.length);
                        break;
                    }
                }
                break;
            }
        }
        //File.saveFileBinaryAnsync(this.bindir + global.filedev + "launcher" + global.filedev + "egret_loader.js",content,function(){},function(){});
        File.addFileList([2,this.bindir + global.filedev + "launcher" + global.filedev + "egret_loader.js",content,"utf-8"]);
    }
    catch (e)
    {
    }
    File.setFileListComplete(completeBack);
    File.copyNextFile();
}

As3TransManager.prototype.changeClassName = function(name)
{
    if(global.packageCut){
        if(name.split(".").length > 2) {
            name = name.split(".")[0] + "." + name.split(".")[name.split(".").length-1];
        }
    }
    return this.transTable.changeClassName(name);
}

global.As3TransManager = As3TransManager;