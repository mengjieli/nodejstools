/**
 * Created by mengj_000 on 2015/4/21.
 */

function As3WhileStmt(expr,stmt)
{
    this.type = "stmt_while";
    this.expr = expr;
    this.stmt = stmt;
}

As3WhileStmt.prototype.printTS = function(before,cls)
{
    var str = "";
    str += before + "while(" + this.expr.printTS("",cls) + ")\r\n";
    str += this.stmt.printTS(before,cls);
    return str;
}

global.As3WhileStmt = As3WhileStmt;