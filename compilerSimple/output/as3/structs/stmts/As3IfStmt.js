/**
 * Created by mengj_000 on 2015/4/21.
 */


function As3IfStmt(expr,stmt,elsestmt)
{
    this.type = "stmt_if";

    this.expr = expr;

    this.stmt = stmt;

    this.elsestmt = elsestmt;
}

As3IfStmt.prototype.printTS = function(before,cls,elseFlag)
{
    var str = "";
    str += (elseFlag==true?"":before) + "if(" + this.expr.printTS("",cls) + ")" + (this.stmt.type=="stmt_block"?"\r\n":"\r\n");
    str += this.stmt.printTS(this.stmt.type=="stmt_block"?before:before + "\t",cls);
    if(this.elsestmt != null)
    {
        str += before + "else";
        if(this.elsestmt.type == "stmt_block")
        {
            str += "\r\n";
            str += this.elsestmt.printTS(before,cls);
        }
        else if(this.elsestmt.type == "stmt_if")
        {
            str += " " + this.elsestmt.printTS(before,cls,true);
        }
        else
        {
            str += "\r\n" + this.elsestmt.printTS(before + "\t",cls);
        }
    }
    return str;
}

global.As3IfStmt = As3IfStmt;