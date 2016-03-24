/**
 * Created by mengj_000 on 2015/4/20.
 */

var As3Function = global.As3Function;
var As3Params = global.As3Params;
var As3Param = global.As3Param;
var As3Type = global.As3Type;

function As3Class(interfaceFlag)
{
    //是否为interface
    this.interfaceFlag = interfaceFlag;
    //packageURL
    this.packageURL = "";
    //名称
    this.name = "";
    //全名
    this.allName = "";
    //继承类名
    this.extendClassName = "";
    //实现接口
    this.implements = [];
    //是否为包外类
    this.internal = false;
    //属性
    this.vars = [];
    //函数
    this.functions = [];
    //当前函数
    this.currentFunction = null;
    //标志进入函数的个数,0个表示未进入函数内部，1个表示进入1个函数，2个表示进入2个函数
    this.functionStack = [];
    //上一个元标签
    this.lastMetaTag = null;
    //顺序
    this.list = [];
    //import目录
    this.imports = [];
    //import Class 类名作为key
    this.importClass = {};
    //import Class 全类名作为key
    //this.importClass2 = {};
    //对应ClassData
    this.data = null;
    //static语句
    this.staticStmts = "";
    //是否为启动类
    this.startApp = false;
    //Embed URL
    this.embedUrls = [];
    //namespaces
    this.namespaces = [];
}

/**
 * 分析完一个Class
 */
As3Class.prototype.complete = function()
{
    var clsName;
    for(var i = 0; i < this.imports.length; i++)
    {
        clsName = this.imports[i].split(".")[this.imports[i].split(".").length-1];
        if(clsName == "*")
        {
        }
        else
        {
            this.importClass[clsName] = this.imports[i];
            this.importClass[this.imports[i]] = this.imports[i];
        }
    }
    this.allName = this.packageURL + (this.packageURL==""?"":".") + this.name;
    this.allNameCut = this.allName.split(".").length>2?this.allName.split(".")[0] + "." + this.allName.split(".")[this.allName.split(".").length-1]:this.allName;


    this.imports.push(this.allName);
    this.importClass[this.name] = this.allName;
    this.importClass[this.allName] = this.allName;
}

As3Class.prototype.setName = function(name)
{
    this.name = name;
}

As3Class.prototype.setExtends = function(extds)
{
    this.extendClassName = extds;
}

As3Class.prototype.addImplements = function(impurl)
{
    this.implements.push(impurl);
}

/**
 * 进入函数体
 */
As3Class.prototype.enterFunction = function()
{
    this.functionStack.push(new As3Function());
    this.currentFunction = this.functionStack[this.functionStack.length-1];
}

/**
 * 退出函数体
 * @param val 函数属性
 */
As3Class.prototype.exitFunction = function(val) {
    var func = this.functionStack.pop();
    if (val != null) func.setAttribute(val);
    if (this.functionStack.length) {
        this.currentFunction = this.functionStack[this.functionStack.length - 1];
    }
    else {
        if (val) {
            this.lastMetaTag = null;
            this.functions.push(func);
            this.list.push(func);
        }
        this.currentFunction = null;
    }
    if (val == null)
    {
        return func.vars;
    }
}

/**
 * 添加变量
 * @param val
 */
As3Class.prototype.addVars = function(vals)
{
    for(var i = 0; i < vals.length; i++)
    {
        if(this.currentFunction)
        {
            this.currentFunction.addVar(vals[i]);
        }
        else
        {
            if(this.lastMetaTag)
            {
                vals[0].addMetaTag(this.lastMetaTag);
                if(this.lastMetaTag.type == 2)
                {
                    this.embedUrls.push(this.lastMetaTag.source);
                }
                this.lastMetaTag = null;
            }
            this.vars.push(vals[i]);
            this.list.push(vals[i]);
        }
    }
}

/**
 * 添加元标签
 * @param val
 */
As3Class.prototype.addMetaTag = function(val)
{
    this.lastMetaTag = val;
}

/**
 * 添加函数外语句，在这个类被解释时执行的，即第一个类对象生成时执行的，相当于static函数执行
 * @param stmt
 */
As3Class.prototype.addStmt = function(stmt)
{
    this.list.push(stmt);
}

/**
 info = {"name":key,"svars":[],"sfunctions":[],"vars":[],"functions":[]};
 item = {"name":v,"static":this.var[cls][v].static,"public":"public","type":this.var[cls][v].type};
 item = {"name":f,"static":this.function[cls][f].static,"public":"public","type":this.function[cls][f].type};
 */
As3Class.prototype.getClassData = function(allclass)
{
    var clsName;
    var name;
    //添加同级目录的import和根目录的import
    //注意**********还没有添加目录下的函数
    for(var key in allclass) {
        if (key.split(".").length == 1)
        {
            this.imports.push(key);
            this.importClass[key] = key;
            this.importClass[key] = key;
        }
        else
        {
            if(this.packageURL != "")
            {
                //if(this.name == "TweenMax" && key == "com.greensock.OverwriteManager") console.log("嗯？",key,key.slice(0,this.packageURL.length) == this.packageURL,key.slice(this.packageURL.length,key.length).split(".").length,key.slice(this.packageURL.length,key.length));
                if(key.slice(0,this.packageURL.length) == this.packageURL && key.slice(this.packageURL.length,key.length).split(".").length == 2)
                {
                    this.imports.push(key);
                    this.importClass[key.split(".")[key.split(".").length-1]] = key;
                    this.importClass[key] = key;
                }
            }
        }
    }

    for(var i = 0; i < this.imports.length; i++)
    {
        clsName = this.imports[i].split(".")[this.imports[i].split(".").length-1];
        if(clsName == "*")
        {
            name = clsName = this.imports[i].slice(0,this.imports[i].length-1);

            for(var key in allclass)
            {
                if(key.slice(0,name.length) == name && key.slice(name.length,key.length).split(".").length == 1)
                {
                    clsName = key.split(".")[key.split(".").length-1];
                    this.imports.push(key);
                    this.importClass[clsName] = key;
                    this.importClass[key] = key;
                }
            }
        }
    }


    for(var i = 0; i < this.imports.length; i++) {
        clsName = this.imports[i].split(".")[this.imports[i].split(".").length - 1];
        if (clsName == "*") {
        }
        else {
            if (clsName == this.extendClassName) this.extendClassName = this.imports[i];
        }
        for (var p = 0; p < this.implements.length; p++)
        {
            if (clsName == this.implements[p])
            {
                this.implements[p] = this.imports[i];
            }
        }
    }

    var info = {"name":this.allName,"extendClassName":this.extendClassName,"implements":this.implements,"svars":[],"sfunctions":[],"vars":[],"functions":[],"internal":this.internal};
    var item;
    for(var i = 0; i < this.vars.length; i++)
    {
        this.vars[i].type.changeVarType(this.importClass);
        item = {"name":this.vars[i].name,"static":this.vars[i].static,"public":this.vars[i].public,"type":this.vars[i].type,"metaTag":this.vars[i].metaTag,"namespace":this.vars[i].namespace};
        if(this.vars[i].static) info.svars.push(item);
        else info.vars.push(item);
    }
    for(i = 0; i < this.functions.length; i++)
    {
        this.functions[i].changeVarType(this.importClass);
        if(this.functions[i].name == this.name) continue;
        if(this.functions[i].set) item = {"name":this.functions[i].name,"static":this.functions[i].static,"public":this.functions[i].public,"type":this.functions[i].params.list[0].type,"namespace":this.functions[i].namespace};
        else item = {"name":this.functions[i].name,"static":this.functions[i].static,"public":this.functions[i].public,"type":this.functions[i].returnType,"namespace":this.functions[i].namespace};
        if(this.functions[i].static)
        {
            if(this.functions[i].set || this.functions[i].get)
                info.svars.push(item);
            else
                info.sfunctions.push(item);
        }
        else
        {
            if(this.functions[i].set || this.functions[i].get)
                info.vars.push(item);
            else
                info.functions.push(item);
        }
    }

    return info;
}

As3Class.prototype.getImport = function(name)
{
    if(this.importClass[name]) return this.importClass[name];
    return null;
}

As3Class.prototype.printTS = function(mgr,before,isFlag)
{
    var runstmts = "";
    this.data = mgr.class[this.allName].class;
    this.functionStack = [];
    this.interfaceSetGet = {};
    this.mgr = mgr;
    var content = "";
    content += before + (this.packageURL!=""?"export":"") + (this.interfaceFlag?" interface ":" class ") + this.name + " " + (this.extendClassName!=""?"extends " + mgr.transTable.changeClassName(this.extendClassName) + " ":"")
    for(var i = 0; i < this.implements.length; i++)
    {
        var implementClass = this.implements[i];
        if(global.packageCut) {
            implementClass = (implementClass.split(".").length>2?implementClass.split(".")[0] + "." + implementClass.split(".")[implementClass.split(".").length-1]:implementClass);
        }
        content += (i==0?"implements ":"") + implementClass + (i<this.implements.length-1?",":" ");
    }
    content += "{\r\n";
    //content += "\r\n";
    for(var i = 0; i < this.list.length; i++)
    {
        //if(this.name == "TweenMax" && i == 1) console.log("啊哈？",this.list[i].type,this.list[i].type.slice,this.list[i].type.slice(0,5) == "stmt_",this.list[i].type.slice(0,5));
        if(this.list[i].type && this.list[i].type.slice && this.list[i].type.slice(0,5) == "stmt_")
        {
            if(this.list[i].type == "stmt_define")
            {

            }
            else
                runstmts += this.list[i].printTS("",this);
        }
        else
        {
            content += this.list[i].printTS(before + "\t",this);
        }
    }
    content += before + "}\r\n";
    if(runstmts != "") this.staticStmts += runstmts;
    return content;
}


As3Class.prototype.getClassAllName = function(name)
{
    if(this.importClass[name]) return this.importClass[name];
    return name;
}

global.As3Class = As3Class;