/**
 * Created by mengj_000 on 2015/4/21.
 * 数组值
 */

var As3Type = global.As3Type;

function As3ArrayValue(val)
{
    this.type = "ArrayValue";
    //存储的值，是一个数组
    this.val = val;
}

As3ArrayValue.prototype.printTS = function(before,cls,info,start)
{
    info.type = new As3Type(1,"Array");
    var str = "[";
    for(var i = 0; i < this.val.length; i++)
    {
        if(this.val[i]) str += this.val[i].printTS("",cls);
        str += i<this.val.length-1?",":"";
    }
    str += "]";
    //console.log("调用Array:",str);
    info.str = str;
}

global.As3ArrayValue = As3ArrayValue;