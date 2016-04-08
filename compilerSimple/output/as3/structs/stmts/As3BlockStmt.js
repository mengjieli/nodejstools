/**
 * Created by mengj_000 on 2015/4/22.
 */


function As3BlockStmt(stmts)
{
    this.type = "stmt_block";
    this.stmts = stmts;
}

As3BlockStmt.prototype.printTS = function(before,cls,isFunction,addStmts)
{
    var bstr = before + "{\r\n";
    var str = "";
    if(addStmts)
    {
        for(var i = 0; i < addStmts.length; i++)
        {
            str += before + "\t" + addStmts[i] + "\r\n";
        }
    }
    //console.log(isFunction,cls.currentFunction.name,cls.name,cls.extendClassName);
    if(isFunction == true && cls.currentFunction && cls.currentFunction.name == cls.name && cls.extendClassName != "")
    {
        var hasSuper = this.stmts==null?false:this.stmts.hasSuperFunction(cls);
        if(hasSuper == false)
        {
            str += before + "\tsuper(";
            //if(cls.currentFunction.params && cls.currentFunction.params.length)
            //{
            //    for(var i = 0; i < cls.currentFunction.params.length; i++)
            //    {
            //        if(cls.currentFunction.params[i].type == 4) continue;
            //        str += cls.currentFunction.params[i].name + (i<cls.currentFunction.params.length-(cls.currentFunction.params[cls.currentFunction.params.length-1].type.type==4?2:1)?",":"");
            //    }
            //}
            str += ");\r\n";
        }
    }
    if(cls.currentFunctionMoreArgument != null)
    {
        str += before + "\tvar " + cls.currentFunctionMoreArgument + ":any = [];\r\n";
        str += before + "\tfor(var i = 0; i < arguments.length; i++)\r\n";
        str += before + "\t{\r\n";
        str += before + "\t   if(i < " + cls.currentFunctionArgumenLength + ") continue;\r\n";
        str += before + "\t   " + cls.currentFunctionMoreArgument + ".push(arguments[i]);\r\n";
        str += before + "\t}\r\n";
    }
    if(this.stmts) str += this.stmts.printTS(before + "\t",cls);
    str += before + "}\r\n";
    if(isFunction && cls.currentFunction.usearguments)
    {
        var begin = "";
        begin += before + "\tvar _arguments__:Array<any> = [];\r\n";
        begin += before + "\tfor(var argumentsLength = 0; argumentsLength < arguments.length; argumentsLength++)\r\n";
        begin += before + "\t{\r\n";
        begin += before + "\t\t_arguments__ = arguments[argumentsLength];\r\n";
        begin += before + "\t}\r\n";
        str = bstr + begin + str;
    }
    else
    {
        str = bstr + str;
    }
    return str;
}

global.As3BlockStmt = As3BlockStmt;