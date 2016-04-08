/**
 * Created by mengj_000 on 2015/4/21.
 */

function As3ForStmt(dexpr,expr1,expr2,stmt)
{
    this.type = "stmt_for";

    this.dexpr = dexpr;
    this.expr1 = expr1;
    this.expr2 = expr2;
    this.stmt = stmt;
}

As3ForStmt.prototype.printTS = function(before,cls)
{
    var str = before + "for(";
    if(this.dexpr)
    {
        if(this.dexpr.type == "stmt_define") str += this.dexpr.printTS("",cls,false) + ";";
        else str += this.dexpr.printTS("",cls) + "; ";
    }
    else str += "; ";
    if(this.expr1) str += this.expr1.printTS("",cls);
    str += "; ";
    if(this.expr2)
    {
        for(var i = 0; i < this.expr2.length; i++)
        {
            str += this.expr2[i].printTS("",cls) + (i<this.expr2.length-1?",":"");
        }
    }
    str += ")\r\n";
    str += this.stmt.type == "stmt_block"?this.stmt.printTS(before,cls):this.stmt.printTS(before+"\t",cls);
    return str;
}

global.As3ForStmt = As3ForStmt;