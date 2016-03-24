/**
 * Created by mengj_000 on 2015/4/21.
 * 返回语句
 */

function As3ReturnStmt(stmt)
{
    this.type = "stmt_return";
    //返回的表达式
    this.stmt = stmt;
}

As3ReturnStmt.prototype.printTS = function(before,cls)
{
    var str = before + "return ";
    var pstr;
    if(this.stmt != null)
    {
        pstr = this.stmt.printTS("",cls);
        if(pstr == "") str += ";\r\n";
        else str += pstr;
    }
    else str += ";\r\n";
    return str;
}

global.As3ReturnStmt = As3ReturnStmt;
