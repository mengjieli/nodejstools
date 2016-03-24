/**
 * Created by mengj_000 on 2015/4/21.
 * 表达式语句
 */

function As3ExprStmt(expr)
{
    //类型标识
    this.type = "stmt_expr";
    //属性值
    this.val = expr;
}

As3ExprStmt.prototype.printTS = function(before,cls)
{
    return before + this.val.printTS(before,cls) + ";\r\n";
}

global.As3ExprStmt = As3ExprStmt;