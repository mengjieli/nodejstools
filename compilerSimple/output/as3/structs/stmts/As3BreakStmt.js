/**
 * Created by mengj_000 on 2015/4/22.
 */


function As3BreakStmt()
{
    this.type = "stmt_break";
}

As3BreakStmt.prototype.printTS = function(before,cls)
{
    return before +"break;\r\n";
}

global.As3BreakStmt = As3BreakStmt;