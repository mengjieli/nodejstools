/**
 * Created by mengj_000 on 2015/4/23.
 */

var As3TransTableItem = global.As3TransTableItem;

function As3TransTable()
{
    this.list = [];

    this.classMap = {};

    //不依赖类的函数转换
    this.sfunction = {};
    //类转换
    this.class = {};
    //属性转换
    this.var = {};
    //转换函数
    this.function = {};
}

As3TransTable.prototype.addItem = function(items)
{
    this.list.push(item);
}

As3TransTable.prototype.fillItemByArray = function(arr)
{
    var item = new As3TransTableItem();
    item.fillByArray(arr);
    this.list.push(item);
    if(item.subType == As3TransTableItem.CLASS)
    {
        this.class[item.class] = item.tclass;
        this.classMap[item.class] = item;
    }
    else if(item.subType == As3TransTableItem.VAR)
    {
        if(this.var[item.class] == undefined) this.var[item.class] = {};
        if(this.var[item.class][item.var] != undefined)
        {
            if(item.set) this.var[item.class][item.var].set = item.set;
            else if(item.get) this.var[item.class][item.var].get = item.get;
        }
        else
        {
            this.var[item.class][item.var] = item;//{"class":item.tclass,"static":item.static,"name":item.tvar,"type":item.type};
        }
    }
    else if(item.subType == As3TransTableItem.FUNCTION)
    {
        if(this.function[item.class] == undefined) this.function[item.class] = {};
        this.function[item.class][item.function] = item;//{"class":item.tclass,"static":item.static,"name":item.tfunction,"params":item.params,"type":item.type};
    }
    else if(item.subType == As3TransTableItem.SFUNCTION)
    {
        this.sfunction[item.function] = item;//{"name":item.tfunction,"params":item.params};
    }
}

/**
 * 获取类信息
 */
As3TransTable.prototype.getClassData = function()
{
    var datas = [];
    var info;
    var item;
    for(var key in this.class)
    {
        info = {"maintype":"class","name":key,"extendClassName":this.classMap[key].extendClassName,"svars":[],"sfunctions":[],"vars":[],"functions":[]};
        for(var cls in this.var)
        {
            if(cls != key) continue;
            for(var v in this.var[cls])
            {
                item = {"name":v,"static":this.var[cls][v].static,"public":"public","type":this.var[cls][v].type};
                if(item.static) info.svars.push(item);
                else info.vars.push(item);
            }
        }
        for(cls in this.function)
        {
            if(cls != key) continue;
            for(var f in this.function[cls])
            {
                item = {"name":f,"static":this.function[cls][f].static,"public":"public","type":this.function[cls][f].type};
                if(item.static) info.sfunctions.push(item);
                else info.functions.push(item);
            }
        }
        datas.push(info);
    }
    for(key in this.sfunction)
    {
        info = {"maintype":"function","name":key,"public":"public","static":true,"type":this.sfunction[key].type};
        datas.push(info);
    }
    return datas;
}

As3TransTable.prototype.getClassMemberVar = function(clsName,varName)
{
    //if(varName == "NUMERIC")
    //{
    //    console.log(clsName,varName,this.var[clsName][varName]);
    //}
    if(this.classMap[clsName])
    {
        if(varName != "toString" && this.var[clsName] && this.var[clsName][varName])
        {
            return this.var[clsName][varName];
        }
        if(this.function[clsName] && this.function[clsName][varName])
        {
            return this.function[clsName][varName];
        }
    }
    return null;
}

As3TransTable.prototype.getSpecialFunction = function(name)
{
    if(this.sfunction[name]) return this.sfunction[name];
    return null;
}

As3TransTable.prototype.changeSpecialFunction = function(name)
{
    if(this.sfunction[name]) return this.sfunction[name].tfunction;
    return name;
}

As3TransTable.prototype.changeClassName = function(name)
{
    //if(name == "flash.utils.Dictionary") console.log("检测到Dictionary了",this.classMap[name]);
    if(this.classMap[name])
    {
        return this.classMap[name].tclass;
    }
    if(global.packageCut){
        if(name.split(".").length > 2) {
            name = name.split(".")[0] + "." + name.split(".")[name.split(".").length-1];
        }
    }
    return name;
}

global.As3TransTable = As3TransTable;
//module.exports = As3TransTable;