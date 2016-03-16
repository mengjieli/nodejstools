/**
 * Created by mengj_000 on 2015/4/24.
 */

function As3ThrowStmt(expr)
{
    this.type = "stmt_throw";
    this.expr = expr;
}

As3ThrowStmt.prototype.printTS = function(before,cls)
{
    return before + "throw " + this.expr.printTS("",cls) + ".message;\r\n";
}

global.As3ThrowStmt = As3ThrowStmt;