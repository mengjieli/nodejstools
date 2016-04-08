/**
 * Created by mengj_000 on 2015/4/21.
 */


function As3ForInStmt(dexpr,expr,stmt)
{
    this.type = "stmt_for_in";

    this.dexpr = dexpr;
    this.expr = expr;
    this.stmt = stmt;
}

As3ForInStmt.prototype.printTS = function(before,cls)
{
    var str = before + "for(";
    var s1;
    var s2;
    var s3;
    var addstmt = "";
    if(this.dexpr.type == "stmt_define")
    {
        s1 = this.dexpr.printTS("",cls,false,false);
        s2 = this.expr.printTS("",cls);
        s3 = ")\r\n";

        if(this.expr.exprType.type == 1 && this.expr.exprType.name == "flash.utils.Dictionary")
        {
            str += "var forinvar__ in " + s2 + ".map" + s3;
            addstmt = s1 + " = " + s2 +  ".map[forinvar__][0];";
        }
        else
        {
            str += s1 + " in " + s2 + s3;
        }
    }
    else
    {
        s1 = this.dexpr.printTS("",cls);
        s2 = this.expr.printTS("",cls);
        s3 = ")\r\n";
        if(this.expr.exprType.type == 1 && this.expr.exprType.name == "flash.utils.Dictionary")
        {
            str += "var forinvar__ in " + s2 + ".map" + s3;
            addstmt = s1 + " = " + s2 +  ".map[forinvar__][0];";
        }
        else
        {
            str += s1 + " in " + s2 + s3;
        }
    }
    if(this.stmt.type=="stmt_block")
    {
        str += this.stmt.printTS(before,cls,false,addstmt==""?undefined:[addstmt]);
    }
    else
    {
        if(addstmt == "")
        {
            str += this.stmt.printTS(before + "\t",cls);
        }
        else
        {
            str += before + "{\r\n";
            str += before + "\t\t" + addstmt + "\r\n";
            str += this.stmt.printTS(before + "\t\t",cls);
            str += before + "}\r\n";
        }
    }
    //str += this.stmt.type=="stmt_block"?this.stmt.printTS(before,cls):this.stmt.printTS(before + "\t",cls);
    return str;
}

global.As3ForInStmt = As3ForInStmt;