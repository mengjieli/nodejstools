/**
 * Created by mengj_000 on 2015/4/21.
 */


function As3DefaultStmt(stmts)
{
    this.type = "stmt_default";
    this.stmts = stmts;
}

As3DefaultStmt.prototype.printTS = function(before,cls)
{
    var str = "";
    str += before + "default :\r\n";
    if(this.stmts) str += this.stmts.printTS(before + "\t",cls);
    return str;
}

global.As3DefaultStmt = As3DefaultStmt;