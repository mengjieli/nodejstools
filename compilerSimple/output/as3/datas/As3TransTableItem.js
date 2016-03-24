/**
 * Created by mengj_000 on 2015/4/23.
 */

var As3Type = global.As3Type;

function As3TransTableItem()
{
    /**
     * 数据类型
     * 1 类对应关系
     * 2 属性对应关系
     * 3 函数对应关系
     * @type {number}
     */
    this.subType = 1;

    //类	继承类	静态	属性	属性状态(0或不填读写1只读2只写)	函数	转换类	转换属性	转换函数	转换函数参数	转换是否实现	错误提示	测试
    this.name = "";
    this.class = "";
    this.extendClassName = "";
    this.static = false;
    this.var = "";
    this.function = "";
    this.type = "";
    this.tclass = "";
    this.tvar = "";
    this.tvarchange = false;
    this.tfunction = "";
    this.tparams = "";
    this.exist = false;
    this.errorTip = "";
    this.test = 0;
    this.set = false;
    this.get = false;
}

As3TransTableItem.prototype.fill = function(obj)
{
    for(var key in obj)
    {
        this[key] = obj[key];
    }
    this.explanType();
}

As3TransTableItem.prototype.fillByArray = function(arr)
{
    //类	继承类	静态	属性	函数  函数set/get	类型(属性类型或者函数返回类型)	转换类	转换属性	转换函数	转换函数参数	转换是否实现	错误提示	测试
    this.name = this.class = As3TransTableItem.delSpace(arr[0]);
    this.extendClassName = As3TransTableItem.delSpace(arr[1]);
    this.static = arr[2]=="1"?true:false;
    this.var = As3TransTableItem.delSpace(arr[3]);
    this.set = arr[4]==""||arr[4]=="set"?true:false;
    this.get = arr[4]==""||arr[4]=="get"?true:false;
    this.function = As3TransTableItem.delSpace(arr[5]);

    if(this.var == "contentLoaderInfo")
    {
        this.type = arr[6]==""?null:As3Type.create(As3TransTableItem.delSpace(arr[6]),true);
    }
    else this.type = arr[6]==""?null:As3Type.create(As3TransTableItem.delSpace(arr[6]));
    this.tclass = As3TransTableItem.delSpace(arr[7]);
    this.delbefore = arr[8]=="1"?true:false;
    this.tvar = As3TransTableItem.delSpace(arr[9]);
    this.tvarchange = As3TransTableItem.delSpace(arr[10])=="1"?true:false;
    this.tfunction = As3TransTableItem.delSpace(arr[11]);
    this.tparams = arr[12];
    this.exist = arr[13]=="1"?true:false;
    this.errorTip = arr[14];
    this.test = arr[15];

    this.explanType();
}

As3TransTableItem.delSpace = function(val)
{
    for(var i = 0; i < val.length; i++)
    {
        if(val.charAt(i) == " " || val.charAt(i) == "\t" || val.charAt(i) == "\r" || val.charAt(i) == "\n")
        {
            val = val.slice(0,i) + val.slice(i+1,val.length);
            i--;
        }
    }
    return val;
}

/**
 * 解析类型
 */
As3TransTableItem.prototype.explanType = function()
{
    if(this.class == "")
    {
        this.subType = As3TransTableItem.SFUNCTION; //独立函数对应关系
        //console.log("独立函数:",this.function," -> ",this.tfunction);
    }
    else if(this.var == "" && this.function == "")
    {
        this.subType = As3TransTableItem.CLASS;//类对应关系
        //console.log("类对应",this.class,this.extendClassName,this.tclass);
    }
    else if(this.var != "")
    {
        this.subType = As3TransTableItem.VAR;//属性对应关系
        if(this.tvar == "") this.tvar = this.var;
        //console.log("属性对应",this.var,this.tvar);
    }
    else if(this.function != "")
    {
        this.subType = As3TransTableItem.FUNCTION;//函数对应关系
        if(this.tfunction == "") this.tfunction = this.function;
        if(this.tparams == "") this.tparams = [];
        else this.tparams = this.tparams.split(" ");
        //console.log("函数对应",this.function,this.tfunction);
    }
}

As3TransTableItem.CLASS = 1;
As3TransTableItem.VAR = 2;
As3TransTableItem.FUNCTION = 3;
As3TransTableItem.SFUNCTION = 4;

global.As3TransTableItem = As3TransTableItem;