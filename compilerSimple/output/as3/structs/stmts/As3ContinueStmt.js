/**
 * Created by mengj_000 on 2015/4/22.
 */


function As3ContinueStmt()
{
    this.type = "stmt_continue";
}

As3ContinueStmt.prototype.printTS = function(before,cls)
{
    return before + "continue;\r\n";
}

global.As3ContinueStmt = As3ContinueStmt;