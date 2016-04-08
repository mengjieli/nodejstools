/**
 * Created by mengj_000 on 2015/4/21.
 */


function As3DoWhileStmt(expr,stmt)
{
    this.type = "stmt_do_while";
    this.expr = expr;
    this.stmt = stmt;
}

As3DoWhileStmt.prototype.printTS = function(before,cls)
{
    var str = "";
    str += before + "do\r\n";
    str += this.stmt.printTS(before,cls);
    str += before + "while(" + this.expr.printTS("",cls) + ")\r\n";
    return str;
}

global.As3DoWhileStmt = As3DoWhileStmt;