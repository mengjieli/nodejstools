/**
 * Created by mengj_000 on 2015/5/5.
 */


function As3SwitchStmt(expr,stmt)
{
    this.type = "stmt_switch";
    this.expr = expr;
    this.stmt = stmt;
}

As3SwitchStmt.prototype.printTS = function(before,cls)
{
    var str = before + "switch(" + this.expr.printTS("",cls) + ")\r\n";
    str += this.stmt.printTS(before,cls);
    return str;
}

global.As3SwitchStmt = As3SwitchStmt;