/**
 * Created by mengj_000 on 2015/4/21.
 */


function As3Param(name,type,init)
{
    this.name = name;
    this.type = type;
    this.init = init;
}

As3Param.prototype.printInitTS = function(before,cls)
{
    if(this.init) return before + this.name + " = " + this.name + "==undefined?" + this.init.printTS("",cls) + ":" + this.name + ";";
    return "";
}

As3Param.prototype.printTS = function(before,cls,initFlag)
{
    var str = this.name + (this.init?"?":"");
    if(this.type) str += ":" + this.type.printTS("",cls,true);
    if(this.init && initFlag) str += " = " + this.init.printTS("",cls);
    return str;
}

global.As3Param = As3Param;