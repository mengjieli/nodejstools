/**
 * Created by mengj_000 on 2015/4/21.
 */

function As3CaseStmt(expr,stmts)
{
    this.type = "stmt_case";
    this.expr = expr;
    this.stmts = stmts;
}

As3CaseStmt.prototype.printTS = function(before,cls)
{
    var str = "";
    str += before + "case " + this.expr.printTS(before,cls) + " :\r\n";
    if(this.stmts) str += this.stmts.printTS(before + "\t",cls);
    return str;
}

global.As3CaseStmt = As3CaseStmt;