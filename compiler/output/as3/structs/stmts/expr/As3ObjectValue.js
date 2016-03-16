/**
 * Created by mengj_000 on 2015/4/21.
 * Object值
 */
var As3Type = global.As3Type;

function As3ObjectValue(val)
{
    this.type = "ObjectValue";
    //Object值，存的一个数组
    this.val = val;
}

As3ObjectValue.prototype.printTS = function(before,cls,info,start)
{
    info.type = new As3Type(1,"Array");
    var str = "{";
    var valstr;
    for(var i = 0; i < this.val.length; i++)
    {
        valstr = this.val[i][1].printTS("",cls);
        if(this.val[i][1].type == "attribute" && this.val[i][1].exprType && this.val[i][1].exprType.type == 1
            && this.val[i][1].exprType.name == "Function" && this.val[i][1].printInfo.last && this.val[i][1].printInfo.last.subType == "function")
        {
            var copy = valstr;
            for(var c = copy.length; c>= 0; c--)
            {
                if(copy.charAt(c) == "." || copy.charAt(c) == "[")
                {
                    copy = copy.slice(0,c);
                    break;
                }
            }
            valstr = valstr + ".bind(" + copy + ")";
        }
        str += this.val[i][0].printSimpleTS("",cls) + ":" + valstr + (i<this.val.length-1?",":"");
    }
    str += "}";
    info.str = str;
}

global.As3ObjectValue = As3ObjectValue;