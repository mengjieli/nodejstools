/**
 * Created by mengj_000 on 2015/4/21.
 */

function As3DefineStmt(vars)
{
    this.type = "stmt_define";
    //定义数组
    this.vars = vars;
}

As3DefineStmt.prototype.printTS = function(before,cls,endFlag,printType)
{
    printType = printType==undefined?true:printType;
    var str = before + "var ";
    for(var i = 0; i < this.vars.length; i++)
    {
        str += this.vars[i].printContentTS(before,cls,printType) + (i<this.vars.length-1?",":"");
    }
    if(endFlag != false)
    {
        if(this.vars[this.vars.length-1].init && this.vars[this.vars.length-1].init.type == "attribute" && this.vars[this.vars.length-1].init.list[0].type == "functionValue")
        {
        }
        else
        {
            str += ";\r\n";
        }
    }
    return str;
}

As3DefineStmt.prototype.clone = function()
{
    var list = [];
    for(var i = 0; i < this.vars.length; i++)
    {
        list.push(this.vars[i].clone());
    }
    return new As3DefineStmt(list);
}

global.As3DefineStmt = As3DefineStmt;