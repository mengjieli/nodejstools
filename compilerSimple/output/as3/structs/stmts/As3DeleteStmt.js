/**
 * Created by mengj_000 on 2015/4/22.
 */


function As3DeleteStmt(expr)
{
    this.type = "stmt_delete";
    this.expr = expr;
}

As3DeleteStmt.prototype.printTS = function(before,cls)
{
    var str = this.expr.printTS("",cls);
    //if(cls.name == "TimeUtils")
    //{
    //    console.log(this.expr.type,this.expr.list.length,this.expr.list[this.expr.list.length-1].type,this.expr.list[this.expr.list.length-2].exprType);
    //    console.log(this.expr.type == "attribute",this.expr.list.length >= 2,(this.expr.list[this.expr.list.length-1].type == "[]" || this.expr.list[this.expr.list.length-1].type == "."),
    //        this.expr.list[this.expr.list.length-2].exprType.type == 1,
    //        this.expr.list[this.expr.list.length-2].exprType.name == "flash.utils.Dictionary");
    //}
    if(this.expr.type == "attribute" && this.expr.list.length >= 2 &&
        (this.expr.list[this.expr.list.length-1].type == "[]" || this.expr.list[this.expr.list.length-1].type == ".") &&
        this.expr.list[this.expr.list.length-2].exprType &&
        this.expr.list[this.expr.list.length-2].exprType.type == 1 &&
        this.expr.list[this.expr.list.length-2].exprType.name == "flash.utils.Dictionary")
    {
        return before + this.expr.printInfo.dicstr + ".delItem(" + this.expr.printInfo.dicparams + ");\r\n";
    }
    //console.log(this.expr);
    return before + "delete " + str + ";\r\n";
}

global.As3DeleteStmt = As3DeleteStmt;