/**
 * Created by mengj_000 on 2015/4/20.
 */

var As3Package = global.As3Package;
var As3Class = global.As3Class;

function As3File(url)
{
    //文件字符个数
    this.contentLength = 0;
    //文件token个数
    this.contentLength = 0;
    //文件路径
    this.url = url;
    //包
    this.package = null;
    //其它imports
    this.imports = [];
    //当前Class
    this.currentClass = null;
    //其它Class
    this.classes = [];
    //进入package标志
    this.packageFlag = false;
    //上一个元标签
    this.lastMetaTag = null;
    //是否为启动类
    this.startApp = false;
    //SWF metaTag
    this.swfTag = null;
    //namespaces
    this.namespaces = [];
}

As3File.prototype.setStart = function()
{
    this.startApp = true;
    this.package.class.startApp = true;
}

/**
 * 进入包体
 */
As3File.prototype.enterPackage = function()
{
    this.package = new As3Package();
    this.packageFlag = true;
}

/**
 * 出包体
 */
As3File.prototype.exitPackage = function()
{
    this.packageFlag = false;
    this.package.complete();
}

/**
 * 设置包路径
 */
As3File.prototype.setPackageURL = function(pkgurl)
{
    this.package.packageURL = pkgurl;
}

/**
 * 添加import路径
 * @param url
 */
As3File.prototype.addImport = function(url)
{
    if(this.packageFlag) this.package.addImport(url);
    else this.imports.push(url);
}

/**
 * 添加命名空间
 * @param namespace
 */
As3File.prototype.addNameSpace = function(namespace)
{
    this.namespaces.push(namespace);
}

/**
 * 进入Class
 */
As3File.prototype.enterClass = function(interfaceFlag)
{
    interfaceFlag = interfaceFlag==undefined?false:interfaceFlag;
    this.currentClass = new As3Class(interfaceFlag);
}

/**
 * 退出Class
 */
As3File.prototype.exitClass = function()
{
    if(this.packageFlag) this.package.class = this.currentClass;
    else
    {
        this.classes.push(this.currentClass);
        this.currentClass.internal = true;
    }
    this.currentClass = null;
}

/**
 * 读取文件完毕
 */
As3File.prototype.readFileComplete = function()
{
    for(var i = 0; i < this.classes.length; i++)
    {
        this.classes[i].imports = this.imports;
        this.classes[i].complete();
    }
    //console.log("解析完毕");
    //console.log(this.package.class.name);
    //for(var i = 0; i < this.classes.length; i++)
    //{
    //    console.log("其它类:",this.classes[i].name)
    //}
}

/**
 * 设置类名
 * @param name
 */
As3File.prototype.setClassName = function(name)
{
    this.currentClass.setName(name);
}

/**
 * 设置继承类
 * @param url
 */
As3File.prototype.setClassExtends = function(url)
{
    this.currentClass.setExtends(url);
}

/**
 * 添加继承接口
 * @param url
 */
As3File.prototype.addClassImplements = function(urls)
{
    for(var i = 0; i < urls.length; i++)
    {
        this.currentClass.addImplements(urls[i]);
    }
}

/**
 * 添加一个变量定义
 * @param val
 */
As3File.prototype.addVars = function(val)
{
    this.currentClass.addVars(val);
}

/**
 * 进入函数
 */
As3File.prototype.enterFunction = function()
{
    this.currentClass.enterFunction();
}

/**
 * 退出函数
 * @param val 函数属性
 */
As3File.prototype.exitFunction = function(val)
{
    return this.currentClass.exitFunction(val);
}

/**
 * 添加元标签
 * @param val
 */
As3File.prototype.addMetaTag = function(val)
{
    val.setPackageURL(this.package.packageURL,this.url);
    if(this.currentClass) this.currentClass.addMetaTag(val);
    else
    {
        this.lastMetaTag = val;
        if(val.type == 1)
        {
            this.swfTag = val;
        }
    }
}

/**
 * 添加语句
 * @param stmt
 */
As3File.prototype.addStmt = function(stmt)
{
    if(this.currentClass) this.currentClass.addStmt(stmt);
}

As3File.prototype.getCurrentFunction = function()
{
    return this.package.currentClass.currentFunction;
}

/**
 * 获取类信息
 */
As3File.prototype.getClassData = function(allclass)
{
    var list = [];
    list.push(this.package.class.getClassData(allclass));
    for(var i = 0; i < this.classes.length; i++)
    {
        list.push(this.classes[i].getClassData(allclass));
    }
    return list;
}

As3File.prototype.getClassNames = function()
{
    var list = [];
    list.push(this.package.class.allName);
    for(var i = 0; i < this.classes.length; i++)
    {
        list.push(this.classes[i].allName);
    }
    return list;
}

As3File.prototype.printTS = function(mgr,embeds) {
    var str = "";
    var arr = this.package.class.allName.split(".");

    global.currentFile = "";
    for(var i = 0; i < arr.length; i++)
    {
        global.currentFile += arr[i] + (i<arr.length-1?"\\":".as");
    }

    global.ExtendClass.push([this.package.class.allName,this.package.class.extendClassName]);

    var content = "";
    var br = "\r\n";
    var before = "";
    var pkgEnd = "";
    if (this.package.packageURL != "") {
        var packages = this.package.packageURL.split(".");
        for (var p = 0; p < packages.length; p++) {
            content += before + (p > 0 ? "export " : "") + "module " + packages[p] + " {\r\n";
            pkgEnd = before + "}\r\n" + pkgEnd;
            before += "\t";
            if(global.packageCut) break;
        }
    }
    this.package.class.namespaces = this.namespaces;
    content += this.package.printTS(mgr, before);
    for (var e = 0; e < this.package.class.embedUrls.length; e++)
    {
        embeds.push(this.package.class.embedUrls[e]);
    }
    for(var i = 0; i < this.classes.length; i++)
    {
        content += "\r\n";
        this.classes[i].imports = this.imports;
        this.classes[i].namespaces = this.namespaces;
        content += this.classes[i].printTS(mgr,before);
        for (var e = 0; e < this.classes[i].embedUrls.length; e++)
        {
            embeds.push(this.classes[i].embedUrls[e]);
        }
    }
    content += pkgEnd;

    content += "\r\n";
    content += this.package.class.staticStmts;
    for(i = 0; i < this.classes.length; i++)
    {
        content += this.classes[i].staticStmts;
    }

    return content;
}

global.As3File = As3File;