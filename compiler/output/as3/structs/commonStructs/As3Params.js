/**
 * Created by mengj_000 on 2015/4/22.
 */


function As3Params()
{
    this.list = [];
}

As3Params.prototype.addParam = function(val)
{
    this.list.push(val);
}

As3Params.prototype.printInitTS = function(before,cls)
{
    var str = "";
    var pstr;
    var flag = false;
    for(var i = 0; i < this.list.length; i++)
    {
        pstr = this.list[i].printInitTS((flag==true?before:""),cls);
        str += pstr;
        if(pstr != "" && i < this.list.length - 1) {
            str += "\r\n";
            flag = true;
        }
    }
    return str;
}

As3Params.prototype.printTS = function(before,cls,initFlag)
{
    var str = "";
    for (var i = 0; i < this.list.length; i++)
    {
        if(this.list[i].type.type == 4)
        {
            str += ",..." + this.list[i].name;
        } else {
            str += this.list[i].printTS(before,cls,initFlag) + (i<this.list.length-(this.list[this.list.length-1].type.type==4?2:1)?",":"");
        }
    }
    return str;
}

global.As3Params = As3Params;