/**
 * Created by mengj_000 on 2015/4/21.
 */

function As3CatchStmt(param,stmt)
{
    this.type = "stmt_catch";
    this.param = param;
    this.stmt = stmt;
}

As3CatchStmt.prototype.printTS = function(before,cls)
{
    var str = "";
    str += before + "catch(" + this.param.printTS(before,cls) + ")\r\n";
    str += this.stmt.printTS(before,cls) + "\r\n";
    return str;
}

global.As3CatchStmt = As3CatchStmt;