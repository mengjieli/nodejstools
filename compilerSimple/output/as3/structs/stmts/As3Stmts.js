/**
 * Created by mengj_000 on 2015/4/22.
 */


function As3Stmts()
{
    this.type = "stmts";
    this.list = [];
}

As3Stmts.prototype.addStmt = function(stmt)
{
    this.list.push(stmt);
}

As3Stmts.prototype.addStmtAt = function(stmt,index)
{
    this.list.splice(index,0,stmt);
}

As3Stmts.prototype.hasSuperFunction = function(cls)
{
    for(var i = 0; i < this.list.length; i++)
    {
        if(this.list[i].type == "stmt_expr")
        {
            if(this.list[i].val.type == "attribute")
            {
                if(this.list[i].val.getHead().valtype == "id" && this.list[i].val.getHead().val == "super")
                {
                    return true;
                }
            }
        }
    }
    return false;
}

As3Stmts.prototype.printTS = function(before,cls)
{
    var str = "";
    for(var i = 0; i < this.list.length; i++)
    {
        str += this.list[i].printTS(before,cls);
    }
    return str;
}

global.As3Stmts = As3Stmts;