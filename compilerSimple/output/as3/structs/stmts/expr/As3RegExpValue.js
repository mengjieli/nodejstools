/**
 * Created by mengj_000 on 2015/5/5.
 */

function As3RegExpValue(val)
{
    this.type = "RegExp";
    this.val = val;
}

As3RegExpValue.prototype.printTS = function(before,cls,info,atr)
{
    info.type = new As3Type(1,"RegExp");
    info.str += this.val;
    return this.val;
}

global.As3RegExpValue = As3RegExpValue;