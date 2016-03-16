/**
 * Created by mengj_000 on 2015/4/20.
 */


function As3Function()
{
    this.public = "public";
    this.static = false;
    this.override = false;
    this.set = false;
    this.get = false;
    this.name = "";
    this.params = null;
    this.returnType = null;
    this.block = null;
    this.vars = [];
    this.usearguments = false;
    this.namespace = "";
}

/**
 * node.expval = {
        "get":false,
        "set":false,
        "gset":false,
        "name":null,
        "params":null,
        "return":null,
        "block":null
    node.expval.override = override;
    node.expval.public = public;
    node.expval.static = static;
    };
 * @param atr
 */
As3Function.prototype.setAttribute = function(atr)
{
    this.static = atr.static;
    this.override = atr.override;
    this.public = atr.public;
    this.set = atr.set;
    this.get = atr.get;
    this.name = atr.name;
    this.params = atr.params;
    this.returnType = atr.return;
    this.block = atr.block;
    if(this.public != "public" && this.public != "private" && this.public != "protected")
    {
        this.namespace = "_";//= this.public;
        this.public = "public";
    }
}

/**
 * 添加函数体内临时变量
 * @param val
 */
As3Function.prototype.addVar = function(val)
{
    this.vars.push(val);
}

As3Function.prototype.getVarType = function(name)
{
    for(var i = 0; i < this.params.list.length; i++)
    {
        if(this.params.list[i].name == name) return this.params.list[i].type;
    }
    for(i = 0; i < this.vars.length; i++)
    {
        if(this.vars[i].name == name) return this.vars[i].type;
    }
    return null;
}

As3Function.prototype.changeVarType = function(imports)
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

As3Function.prototype.printTS = function(before,cls) {
    global.Log.log("\t " + this.name);
    cls.currentFunctionMoreArgument = null;
    cls.currentFunctionArgumenLength = 0;
    cls.functionStack.push(this);
    cls.currentFunction = this;
    var str = "";
    if (cls.name == this.name) str += "\r\n";
    str += before;
    //str += value.override==true?"override ":"";
    if (!cls.interfaceFlag)
    {
        str += {
            "public": "public",
            "protected": "public",
            "private": "private"
        }[(this.public)] + " ";
        if(this.static) str += "static ";
    }
    if (!cls.interfaceFlag)
        str += this.get || this.set ? (this.get ? "get " : "set ") : "";
    if (!cls.interfaceFlag || (cls.interfaceFlag && !this.set  && !this.get))
    {
        str += (cls.name == this.name ? "constructor" : (this.namespace!=""?this.namespace+"_":"") + this.name) + "(";
        if(this.params) str += this.params.printTS("",cls,false);
        str += ")";
        if(this.returnType != null && cls.name != this.name && !this.set)
        {
            if(this.returnType.type != 3) str += ":" + this.returnType.printTS("",cls);
        }
    }
    else
    {
        if(this.set) str += (this.namespace!=""?this.namespace+"_":"") + this.name + ":" + this.params.list[0].type.printTS("",cls);
        else str += (this.namespace!=""?this.namespace+"_":"") + this.name + ":" + this.returnType.printTS("",cls);
    }
    if (!cls.interfaceFlag) str += "\r\n";
    if(this.params && this.params.list.length && this.params.list[this.params.list.length-1].type.type == 4)
    {
        cls.currentFunctionMoreArgument = this.params.list[this.params.list.length-1].name;
        cls.currentFunctionArgumenLength = this.params.list.length - 1;
    }
    var addInit = "";
    if(this.params)
    {
        addInit = this.params.printInitTS(before + "\t",cls);
    }
    if (!cls.interfaceFlag)
    {
        if(addInit != "") str += this.block.printTS(before,cls,true,[addInit]);
        else str += this.block.printTS(before,cls,true);
        str += "\r\n";
    }
    else
    {
        str += ";\r\n";
    }
    cls.currentFunctionMoreArgument = null;
    cls.currentFunctionArgumenLength = 0;
    cls.functionStack.pop();
    return str;
}

global.As3Function = As3Function;