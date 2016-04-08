/**
 * Created by mengj_000 on 2015/4/21.
 * 属性表达式，例如this.abc,this["abc"],(expr).abc之类
 */

function As3ExprAtr()
{
    this.type = "attribute";
    //属性项列表
    this.list = [];
}

/**
 * 添加一个属性项
 * @param item
 */
As3ExprAtr.prototype.addItem = function(item)
{
    this.start = false;
    this.list.push(item);
    //printTS时计算
    this.exprType = null;
    this.printInfo = null;
}

As3ExprAtr.prototype.getHead = function()
{
    return this.list[0];
}

As3ExprAtr.prototype.getLength = function()
{
    return this.list.length;
}

As3ExprAtr.prototype.printTS = function(before,cls,info)
{
    //if(toIndex == undefined)
    //{
    //    toIndex = this.list.length;
    //}
    var errorFlag = false;
    if(this.start == true)
    {
        info = {"str":"","type":null,"last":null};
        global.Statistics.addAPI();
        global.Statistics.addExpr();
    }
    //console.log("分析Atr,",this.list.length);
    var list = this.list;
    var item;
    for(var i = 0; i <  this.list.length; i++)
    {
        list[i].printTS(before,cls,info,i==0?true:false,this);
        if(this.start && !errorFlag && i < this.list.length - 1)
        {
            if(info.type == null || info.type.type == 0)
            {
                global.Statistics.addExprWarn(cls.allName,global.Log.getFilePos(this.debug.file,this.tokenPos),info.str);
                errorFlag = true;
            }
        }
    }
    if(this.start)
    {
        this.exprType = info.type;
        this.printInfo = info;
        //if(this.exprType == null || this.exprType.type == 0)
        //{
        //    global.Statistics.addExprWarn(cls.allName,global.Log.getFilePos(this.debug.file,this.tokenPos),info.str);
        //}
        return info.str;
    }
    return str;
}

global.As3ExprAtr = As3ExprAtr;
