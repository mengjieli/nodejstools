/**
 * Created by mengj_000 on 2015/4/23.
 */


var VarData = global.VarData;
var FunctionData = global.FunctionData;

function ClassData()
{
    //父类
    this.super = null;
    //包路径
    this.package = "";
    //名称
    this.name = "";
    //单名,不是全类名
    this.singleName = "";
    //继承类名
    this.extendClassName = "";
    //是否为internal
    this.internal = false;
    //静态变量
    this.svars = {};
    //静态函数
    this.sfunctions = {};
    //成员变量
    this.vars = {};
    //成员函数
    this.functions = {};
    //是否检测过
    this.check = false;
}

/**
 * 继承类
 * @param cls
 */
ClassData.prototype.extendClass = function(cls)
{
    this.super = cls;
    //console.log(this.name + " 继承-> " + cls.name);
    for(var key in cls.vars)
    {
        if(cls.vars[key].public == "public" || cls.vars[key].public == "protected")
        {
            this.vars[key] = cls.vars[key];
            //if(this.name == "flash.display.Sprite")
            //{
            //    console.log(key);
            //}
        }
    }
    for(var key in cls.svars)
    {
        if(cls.svars[key].public == "public" || cls.svars[key].public == "protected")
        {
            this.svars[key] = cls.svars[key];
        }
    }
    for(key in cls.functions)
    {
        if((cls.functions[key].public == "public" || cls.functions[key].public == "protected") && key != cls.singleName)
        {
            this.functions[key] = cls.functions[key];
        }
    }
    for(key in cls.sfunctions)
    {
        if((cls.sfunctions[key].public == "public" || cls.sfunctions[key].public == "protected") && key != cls.singleName)
        {
            this.sfunctions[key] = cls.sfunctions[key];
        }
    }
}

ClassData.prototype.getMember = function(name)
{
    if(name != "toString" && name != "hasOwnProperty" && name != "isPrototypeOf" && this.vars[name] != undefined) return this.vars[name];
    if(this.functions[name] != undefined) return this.functions[name];
    return null;
}

ClassData.prototype.getThis = function(name)
{
    //if(name == "toString") name = "toString__";
    if(this.vars[name] != undefined) return this.vars[name];
    if(this.functions[name] != undefined) return this.functions[name];
    return false;
}

ClassData.prototype.isThisStatic = function(name)
{
    if(this.svars[name] != undefined) return true;
    if(this.sfunctions[name] != undefined) return true;
    return false;
}

ClassData.prototype.getStaticMember = function(name)
{
    if(this.svars[name] != undefined) return this.svars[name];
    if(this.sfunctions[name] != undefined) return this.sfunctions[name];
    return null;
}

/**
 info = {"name":key,"svars":[],"sfunctions":[],"vars":[],"functions":[]};
 item = {"name":v,"static":this.var[cls][v].static,"public":"public","type":this.var[cls][v].type};
 item = {"name":f,"static":this.function[cls][f].static,"public":"public","type":this.function[cls][f].type};
 * @param data
 */
ClassData.createClassData = function(data,internal)
{
    var cd = new ClassData();
    if(data.name.split(".").length > 1)
    {
        cd.name = data.name;
        cd.package = data.name.slice(0,data.name.length-(cd.name.split(".")[cd.name.split(".").length-1]).length-1);
    }
    else
    {
        cd.name = data.name;
    }
    cd.singleName = cd.name.split(".")[cd.name.split(".").length-1];
    cd.extendClassName = data.extendClassName;
    var val;
    for(var i = 0; i < data.svars.length; i++)
    {
        val = new VarData(data.svars[i].public,data.svars[i].static,data.svars[i].name,data.svars[i].type,data.svars[i].metaTag,data.svars[i].namespace);
        val.class = data.name;
        cd.svars[val.name] = val;
    }
    for(i = 0; i < data.vars.length; i++)
    {
        val = new VarData(data.vars[i].public,data.vars[i].static,data.vars[i].name,data.vars[i].type,data.vars[i].metaTag,data.vars[i].namespace);
        val.class = data.name;
        cd.vars[val.name] = val;
    }
    for(i = 0; i < data.sfunctions.length; i++)
    {
        //pb,st,name,returnType)
        val = new FunctionData(data.sfunctions[i].public,data.sfunctions[i].static,data.sfunctions[i].name,data.sfunctions[i].type,data.sfunctions[i].namespace);
        val.class = data.name;
        cd.sfunctions[val.name] = val;
    }
    for(i = 0; i < data.functions.length; i++)
    {
        //pb,st,name,returnType)
        val = new FunctionData(data.functions[i].public,data.functions[i].static,data.functions[i].name,data.functions[i].type,data.functions[i].namespace);
        val.class = data.name;
        cd.functions[val.name] = val;
    }

    //if(cd.name == "Array") console.log(data);

    //console.log();
    //console.log("ClassName : ",cd.name);
    //console.log("Package : ",cd.package);
    //for(var i in cd.svars)
    //{
    //    console.log("Static Atr : ",cd.svars[i].name);
    //}
    //for(i in cd.vars)
    //{
    //    console.log("Atr : ",cd.vars[i].name);
    //}
    //for(i in cd.sfunctions)
    //{
    //    console.log("Static Func : ",cd.sfunctions[i].name);
    //}
    //for(i in cd.functions)
    //{
    //    console.log("Func : ",cd.functions[i].name);
    //}
    return cd;
}

global.ClassData = ClassData;