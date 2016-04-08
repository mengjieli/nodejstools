/**
 * Created by mengj_000 on 2015/4/21.
 */

/*
 node.expval = {
 "get":false,
 "set":false,
 "gset":false,
 "name":null,
 "params":null,
 "return":null,
 "block":null
 */
function As3FunctionValue(val)
{
    this.type = "functionValue";
    this.get = val.get;
    this.set = val.set;
    this.name = val.name==null?"":val.name;
    this.params = val.params==null?[]:val.params;
    this.returnType = val.return;
    this.block = val.block;
    this.vars = [];
    this.parentFunction = null;
    this.usearguments = false;
}

As3FunctionValue.prototype.changeVarType = function(imports)
{
    for(var i = 0; i < this.params.list.length; i++)
    {
        this.params.list[i].type.changeVarType(imports);
    }
    for(i = 0; i < this.vars.length; i++)
    {
        this.vars[i].type.changeVarType(imports);
    }
    this.returnType.changeVarType(imports);
}

/**
 * 添加函数体内临时变量
 * @param val
 */
As3FunctionValue.prototype.addVars = function(vals)
{
    this.vars = this.vars.concat(vals);
}

As3FunctionValue.prototype.getVarType = function(name)
{
    for(var i = 0; i < this.params.list.length; i++)
    {
        if(this.params.list[i].name == name) return this.params.list[i].type;
    }
    for(i = 0; i < this.vars.length; i++)
    {
        if(this.vars[i].name == name) return this.vars[i].type;
    }
    if(this.parentFunction != null) return this.parentFunction.getVarType(name);
    return null;
}

As3FunctionValue.prototype.printTS = function(before,cls,info,start)
{
    this.changeVarType(cls.importClass);
    cls.currentFunctionMoreArgument = null;
    cls.currentFunctionArgumenLength = 0;
    if(cls.functionStack.length) this.parentFunction = cls.functionStack[cls.functionStack.length-1];
    cls.functionStack.push(this);
    var str = "";
    if(this.get) str += "get ";
    else if(this.set) str += "set ";
    else str += "function ";
    if(this.name != "") str += this.name + " ";
    str += "(";
    if(this.params)
    {
        str += this.params.printTS("",cls);
    }
    str += ")";
    str += this.returnType.type==3?"":":" + this.returnType.printTS(before,cls);
    str += "\r\n";
    if(this.params && this.params.list.length && this.params.list[this.params.list.length-1].type.type == 4)
    {
        cls.currentFunctionMoreArgument = this.params.list[this.params.list.length-1].name;
        cls.currentFunctionArgumenLength = this.params.list.length - 1;
    }
    this.block.isValue = true;
    str += this.block.printTS(before,cls,true);
    cls.functionStack.pop();
    cls.currentFunctionMoreArgument = null;
    cls.currentFunctionArgumenLength = 0;
    info.str = str;
    info.type = new As3Type(0,"Function");
    info.last = new FunctionData(false,false,this.name,this.returnType);
    while(str.charAt(str.length-1) == "\n" || str.charAt(str.length-1) == "\r") {
        str = str.slice(0,str.length-1);
    }
    return str;
}

global.As3FunctionValue = As3FunctionValue;