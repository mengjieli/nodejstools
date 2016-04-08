/**
 * Created by mengj_000 on 2015/4/21.
 */

function As3TryStmt(stmt,catchStmt)
{
    this.type = "stmt_try";
    this.stmt = stmt;
    this.catchStmts = catchStmt;
}

As3TryStmt.prototype.printTS = function(before,cls)
{
    var str = "";
    str += before + "try ";
    if(this.stmt.type == "stmt_block")
    {
        str += "\r\n";
        str += this.stmt.printTS(before,cls);
    }
    else
    {
        str += this.stmt.printTS("",cls);
    }
    if(this.catchStmts)
    {
        for(var i = 0; i < this.catchStmts.length; i++)
        {
            str += this.catchStmts[i].printTS(before,cls);
        }
    }
    return str;
}

global.As3TryStmt = As3TryStmt;