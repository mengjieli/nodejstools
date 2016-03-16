/**
 * Created by mengj_000 on 2015/4/21.
 */

function As3ForEachStmt(dexpr,expr,stmt)
{
    this.type = "stmt_for_each";

    this.dexpr = dexpr;
    this.expr = expr;
    this.stmt = stmt;
}

As3ForEachStmt.prototype.printTS = function(before,cls)
{
    var keyName;
    var addStmt = "";
    var str = "";
    var copy;
    var exprstr;
    if(this.dexpr.type == "stmt_define")
    {
        //pb,st,vf,param
        keyName = this.dexpr.vars[0].name;
        copy = this.dexpr.clone();
        copy.vars[0].type = null;
        copy.vars[0].name += "_key_a";
        cls.currentFunction.addVar(new global.As3Var(false,false,true,{"name":copy.vars[0].name,"type":new global.As3Type(0)}));
        exprstr = this.expr.printTS("",cls);
        if(this.expr.exprType.type == 1 && this.expr.exprType.name == "flash.utils.Dictionary")
        {
            addStmt += "var " + keyName + (this.dexpr.vars[0].type?":" + this.dexpr.vars[0].type.printTS("",cls):"") + " = " + exprstr + ".map[" + copy.vars[0].name + "][1];";
        }
        else
        {
            addStmt += "var " + keyName + (this.dexpr.vars[0].type?":" + this.dexpr.vars[0].type.printTS("",cls):"") + " = " + exprstr + "[" + copy.vars[0].name + "];";
        }
    }
    else if(this.dexpr.type == "attribute")
    {
        keyName = this.dexpr.list[0].val;
        this.dexpr.list[0].val += "_key_a";
        str += before + "var " + this.dexpr.list[0].val + ";\r\n";
        cls.currentFunction.addVar(new global.As3Var(false,false,true,{"name":this.dexpr.list[0].val,"type":new global.As3Type(0)}));
        exprstr = this.expr.printTS("",cls,false);
        if(this.expr.exprType.type == 1 && this.expr.exprType.name == "flash.utils.Dictionary")
        {
            addStmt += keyName + " = " + exprstr + ".map[" + this.dexpr.list[0].val + "][1];";
        }
        else
        {
            addStmt += keyName + " = " + exprstr + "[" + this.dexpr.list[0].val + "];";
        }
    }
    if(this.dexpr.type == "stmt_define")
    {
        if(this.expr.exprType.type == 1 && this.expr.exprType.name == "flash.utils.Dictionary")
        {
            str += before + "for(" + copy.printTS("",cls,false) + " in " +  (this.expr==null?"":this.expr.printTS("",cls)) + ".map)\r\n";
        }
        else
        {
            str += before + "for(" + copy.printTS("",cls,false) + " in " +  (this.expr==null?"":this.expr.printTS("",cls)) + ")\r\n";
        }
    }
    else
    {
        if(this.expr.exprType.type == 1 && this.expr.exprType.name == "flash.utils.Dictionary")
        {
            str += before + "for(" + this.dexpr.printTS("", cls, false) + " in " + (this.expr == null ? "" : this.expr.printTS("", cls)) + ".map)\r\n";
        }
        else
        {
            str += before + "for(" + this.dexpr.printTS("", cls, false) + " in " + (this.expr == null ? "" : this.expr.printTS("", cls)) + ")\r\n";
        }
    }


    //if(this.expr.exprType.type == 1 && this.expr.exprType.name == "flash.utils.Dictionary")
    //{
    //    console.log("for each遍历Dictionary，",cls.name,cls.currentFunction.name);
    //}

    if(this.stmt.type=="stmt_block")
    {
        str += this.stmt.printTS(before,cls,false,[addStmt]);
    }
    else
    {
        str += before + "{\r\n";
        str += before + "\t" + addStmt + "\r\n";
        str += this.stmt.printTS(before + "\t",cls);
        str += before + "}\r\n";
    }
    return str;
}

global.As3ForEachStmt = As3ForEachStmt;